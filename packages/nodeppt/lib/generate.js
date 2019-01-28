/**
 * @file 根据模板生成项目目录结构
 */
const path = require('path');
const fs = require('fs');
const exists = fs.existsSync;

const semver = require('semver');
const through = require('through2');
const Handlebars = require('handlebars');
const vfs = require('vinyl-fs');
const render = require('consolidate').handlebars.render;
const concat = require('concat-stream');
const filter = require('gulp-filter');
const rename = require('gulp-rename');
const {
    error,
    log,
    chalk,
    evaluate,
    success,
    line,
    getGitUser,
    getLatestVersion,
    logWithSpinner,
    updateSpinner,
    stopSpinner,
    getDebugLogger
} = require('nodeppt-shared-utils');
const {name, version: localVersion} = require('../package.json');
const debug = getDebugLogger('generate', name);

const ask = require('./ask');

let newVersion = 0;
getLatestVersion().then(latest => {
    if (semver.lt(localVersion, latest)) {
        newVersion = latest;
    }
});
// 增加 handleba helper
Handlebars.registerHelper('if_eq', (a, b, opts) => {
    return a === b ? opts.fn(this) : opts.inverse(this);
});

Handlebars.registerHelper('unless_eq', (a, b, opts) => {
    return a === b ? opts.inverse(this) : opts.fn(this);
});

module.exports = async (name, src, dest, cmdOpts) => {
    // 0. 设置meta信息
    const opts = getMetadata(src);
    opts.name = name;
    const {name: gitUser, email: gitEmail, author} = getGitUser();
    opts.author = author;
    opts.email = gitEmail;
    opts.username = gitUser;

    debug(opts);

    // 1. 添加 handlebar helper
    // eslint-disable-next-line
    opts.helpers &&
        Object.keys(opts.helpers).map(key => {
            Handlebars.registerHelper(key, opts.helpers[key]);
        });

    // 2. 请回答
    const answers = await ask(opts.prompts || {}, opts);
    const data = Object.assign(
        {
            destDirName: name,
            inPlace: dest === process.cwd(),
            noEscape: true
        },
        answers
    );
    debug(data);

    // 处理过滤
    const rootSrc = ['**/*', '!node_modules/**'];
    if (opts.filters) {
        const filters = Object.keys(opts.filters);
        const globs = filters.filter(glob => {
            return evaluate(opts.filters[glob], data);
        });

        if (globs.length) {
            globs.map(glob => {
                rootSrc.push(`!${glob}`);
            });
        }
    }

    debug(rootSrc);
    // 过滤 _ dotFile
    const dotFileFilter = filter(['**/_*'], {
        restore: true
    });
    // 过滤 {{}} 的文件
    const braceFileFilter = filter(['**/{{*'], {
        restore: true
    });
    // 复制代码vfs
    let templateDir = path.join(src, 'template');

    if (!exists(templateDir)) {
        // 不存在 template 则以整个文件夹做根目录
        templateDir = src;
    }
    console.log();
    logWithSpinner('🐝', 'Start...');
    vfs.src(rootSrc, {cwd: templateDir, cwdbase: true, dot: true})
        // 过滤
        // .pipe(f)
        // 4. 增加 handlerbar
        .pipe(streamFile(template, data))
        // 处理 _ 开头文件为 .开头
        .pipe(dotFileFilter)
        .pipe(
            rename((path, file) => {
                if (!file.isDirectory()) {
                    path.extname = path.basename.replace(/^_/, '.');
                    path.basename = '';
                }

                return path;
            })
        )
        .pipe(dotFileFilter.restore)
        // 处理文件命名中出现{{}}的情况
        .pipe(braceFileFilter)
        .pipe(
            rename(path => {
                let m = path.basename.match(/^{{(.+?)}}$/);
                if (m && m[1] && typeof data[m[1]] === 'string') {
                    path.basename = data[m[1]];
                    return path;
                }

                return path;
            })
        )
        .pipe(braceFileFilter.restore)
        .pipe(vfs.dest(dest))
        .on('end', async () => {
            updateSpinner('🐝', 'Template install success!');
            stopSpinner();
            line(' 🎉  Success! ');

            if (typeof opts.complete === 'function') {
                // 跟 vue template 参数保持一致
                opts.complete(data, {
                    chalk,
                    logger: {
                        log,
                        fatal: error,
                        success: success
                    },
                    files: []
                });
            } else {
                logMessage(opts.completeMessage, data);
            }
        })
        .on('error', err => {
            error(err);
        })
        .resume();
};

function logMessage(message, data) {
    if (isHandlebarTPL(message)) {
        render(message, data)
            .then(res => {
                log(res);
            })
            .catch(err => {
                error('\n   Error when rendering template complete message：' + err.message.trim());
                debug(message, data, err);
            });
    } else if (message) {
        log(message);
    }

    if (newVersion) {
        /* eslint-disable*/
        console.log(
            chalk.green(`
            ┌────────────────────────────────────────────${`─`.repeat(newVersion.length)}──┐
            │  A newer version of nodeppt is available: ${chalk.yellow(localVersion)}  │
            └────────────────────────────────────────────${`─`.repeat(newVersion.length)}──┘`)
        );
        /* eslint-enable*/
    }
}

function getMetadata(dir) {
    const json = path.join(dir, 'meta.json');
    const js = path.join(dir, 'meta.js');
    let opts = {};

    if (exists(json)) {
        const content = fs.readFileSync(json, 'utf-8');
        opts = JSON.parse(content);
    } else if (exists(js)) {
        const req = require(path.resolve(js));
        if (req !== Object(req)) {
            throw new Error('meta.js syntax error');
        }

        opts = req;
    }

    return opts;
}
function isHandlebarTPL(content) {
    return /{{([^{}]+)}}/g.test(content);
}
function template(content, file, cb, data) {
    if (!isHandlebarTPL(content)) {
        return cb(null, file);
    }

    render(content, data)
        .then(res => {
            file.contents = new Buffer(res);
            cb(null, file);
        })
        .catch(err => {
            debug(`[${file.path}]`);
            err.message = `[${file.path}] ${err.message}`;
            cb(err);
        });
}

function streamFile(fn, ...args) {
    return through.obj((file, enc, cb) => {
        if (file.isBuffer()) {
            // console.log(file.path, enc);
            const str = file.contents.toString();
            fn(str, file, cb, ...args);
        } else if (file.isStream()) {
            file.contents.pipe(
                concat(str => {
                    try {
                        fn(str, file, cb, ...args);
                    } catch (e) {
                        cb(e);
                    }
                })
            );
        } else {
            cb(null, file);
        }
    });
}
