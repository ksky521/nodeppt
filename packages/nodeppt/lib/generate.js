/**
 * @file 根据模板生成项目目录结构
 */
const path = require('path');
const fs = require('fs');
const exists = fs.existsSync;

const semver = require('semver');
const Handlebars = require('handlebars');
const username = require('username');
const render = require('consolidate').handlebars.render;
const {
    error,
    log,
    chalk,
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

module.exports = async (src, dest, cmdOpts) => {
    // 0. 设置meta信息
    const opts = getMetadata(src);
    try {
        opts.username = await username();
    } catch (e) {
        const {name: gitUser} = getGitUser();
        opts.username = gitUser;
    }

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
            filename: dest,
            inPlace: dest === process.cwd(),
            noEscape: true
        },
        answers
    );
    debug(data);
    console.log();
    logWithSpinner('🐝', '开始初始化模板...');

    const tpl = getTemplateContent(src);
    const content = await template(tpl, data);

    fs.writeFileSync(path.resolve(dest), content);

    updateSpinner('🐝', `${dest} create success!`);
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
            }
        });

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
    } else {
        logMessage(opts.completeMessage, data);
    }
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

function getTemplateContent(dir) {
    const md = path.join(dir, 'template.md');
    const markdown = path.join(dir, 'template.markdown');
    if (exists(md)) {
        const content = fs.readFileSync(md, 'utf-8');
        return content;
    } else if (exists(markdown)) {
        const content = fs.readFileSync(markdown, 'utf-8');
        return content;
    } else {
        throw new Error('template.md not exist');
    }
}

function isHandlebarTPL(content) {
    return /{{([^{}]+)}}/g.test(content);
}
function template(content, data) {
    if (!isHandlebarTPL(content)) {
        return Promise.resolve(content);
    }

    return render(content, data);
}
