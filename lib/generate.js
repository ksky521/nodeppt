var fs = require('fs');
var path = require('path');
var debug = require('debug')('generate');

var md_parser = require('./md_parser');
var $ = require('./helper');
var rootDir = path.join(__dirname, '../') + path.sep;
var assetsDir = path.join(rootDir, 'assets') + path.sep;
var pptsDir = path.join(rootDir, 'ppts') + path.sep;
var templateDir = path.join(rootDir, 'template') + path.sep;
var nodeModules = path.normalize(path.join(__dirname, '../node_modules')) + path.sep;

//1. 只导出文件nodeppt generate file.md
//2. 导出文件+目录 nodeppt generate ./ --all -o publish
module.exports = function (filepath, outputDir, isAll, rDir) {
    filepath = fs.realpathSync(filepath);
    outputDir = outputDir ? $.getDirPath(outputDir) : $.getDirPath(path.join(process.cwd(), './publish'));
    isAll = !!isAll;
    if (isAll) {
        //1.导出默认的assets
        $.copy(assetsDir, outputDir, function (filename, dir, subdir) {
            if (!subdir || subdir === 'scss') {
                //不复制scss
                return false;
            }
            return true;
        });
    }
    //2.导出复制filepath除根目录下img、css和js等到assets，遇见/*.md就解析
    generate(filepath, outputDir, rDir);
    console.log('生成结束！'.bold.green + require('path').relative('b:/', outputDir).yellow);
};

function parser(content, template) {
    try {
        var html = md_parser(content, null, null, null, {
            generate: true
        });
        return html;
    } catch (e) {
        console.log('ERROR: '.bold.red + e.toString());
    }
    return false;
}

/**
 * 生成
 * @param  {[type]} filepath  [description]
 * @param  {[type]} outputDir [description]
 * @return {[type]}           [description]
 */
function generate(filepath, outputDir, rDir) {
    rDir = rDir || '.';
    var filename = '';
    var templateMd = $.readFile(templateDir + 'markdown.ejs');
    var templateList = $.readFile(templateDir + 'list.ejs');

    if ($.isDir(filepath, true)) {
        //遍历目录生成htm
        var indexList = '';
        $.copy(filepath, outputDir, function (filename, dir, subdir) {
            if (!subdir && /\.(?:md|markdown)$/i.test(filename)) {
                var content = $.readFile(path.join(filepath, filename));
                var html = parser(content);
                if (html) {
                    var title = html.match(/<title>(.*?)<\/title>/);
                    if (title && title[1]) {
                        title = title[1];
                    } else {
                        title = filename;
                    }

                    var url = filename.replace(/\.(?:md|markdown)$/i, '.htm');
                    indexList += '<li><a class="star" href="' + url + '" target="_blank">' + title + '</a> &nbsp; [<a href="' + url + '?_multiscreen=1" target="_blank" title="多窗口打开">多窗口</a>]</li>';

                    copyLinkToOutput(content, filepath, outputDir, rDir);
                    html = handlerHTML(html, rDir);
                    $.writeFile(path.join(outputDir, filename.replace(/\.(?:md|markdown)$/i, '.htm')), html);
                }
                return false;
            }
            return true;
        });
        //输出index文件
        var packageJson = require(rootDir + 'package.json');

        var data = {
            version: packageJson.version,
            site: packageJson.site,
            date: Date.now(),
            list: indexList,
            dir: '/'
        };

        indexList = $.renderStr(templateList, data);
        $.writeFile(path.join(outputDir, 'index.html'), indexList);
    } else {
        var content;
        if ($.exists(filepath) && $.isFile(filepath)) {
            content = $.readFile(filepath);
        } else {
            return console.log('ERROR: '.bold.red + filepath + ' is not exists!');
        }
        filename = path.basename(filepath);
        copyLinkToOutput(content, filepath, outputDir, rDir);
        var html = parser(content);
        if (html) {
            html = handlerHTML(html, rDir);
            $.writeFile(path.join(outputDir, filename.replace(/\.(?:md|markdown)$/i, '.htm')), html);
        }
    }
}

//处理绝对路径的url
function handlerHTML(html, rDir) {
    html = html.replace(/(src|href|url)([=|\(])(["'])\/\//gi, '$1$2$3<=PLACEHOLDER=>//')
        .replace(/(src|href|url)([=|\(])(["'])\//gi, '$1$2$3' + rDir + '/')
        .replace(/(src|href|url)([=|\(])(["'])<=PLACEHOLDER=>\//gi, '$1$2$3//')
        .replace(/loadJS\(['"]\/js/g, "loadJS($1" + rDir + "/js").replace(/dir:\s*(["'])\/js\/\1,/g, "dir: $1" + rDir + "/js/$1,");

    return html;
}

//处理页面相对url，到目标文件夹
function copyLinkToOutput(content, filepath, outputDir) {
    var files = [];
    content.replace(/(!)?\[.+?\]\(\s?(.*?)\s?\)/g, function (i, isImg, file) {
        //处理markdown内部，[inline模式](/assets/box-fe-road/img/inline-mode.png)
        if (isImg && file) {
            file = file.split(/\s+/)[0];
        }
        // console.log(file);
        files.push(file);
    }).replace(/(?:href|src|url)[=|\(](['"])?(.+?)\1/g, function (i, q, file) {
        files.push(file);
    });
    //解析cover
    var json = md_parser.parseCover(content.split(/\[slide.*\]/i)[0]);
    if (json.files) {
        files = files.concat(json.files.split(/\s?,\s?/));
    }
    if (json.usemathjax === 'yes') {
        $.copy(nodeModules + 'mathjax/', outputDir + 'js/mathjax/', function (filename, dir, subdir) {
            if (/^(?:docs|unpacked|test)/.test(subdir)) {
                //不复制
                return false;
            }
            var ext = path.extname(filename);
            // console.log(ext);
            if (!ext || ['.md', '.txt', '.json'].indexOf(ext) !== -1) {
                return false;
            }
            return true;
        });
    }
    files.filter(function (f) {
        if (/^http[s]?:\/\//.test(f) || /^\/\//.test(f) || ['#', '/'].indexOf(f) !== -1 || /^\?/.test(f) || /^about\:/.test(f)) {
            //过滤掉外链
            return false;
        }
        return true;
    }).forEach(function (f) {
        var topath = path.join(outputDir, f);
        var realpath = path.join(path.dirname(filepath), f);
        if ($.exists(realpath) && $.isFile(realpath)) {
            var data = fs.readFileSync(String(realpath));
            $.writeFile(topath, data);
        }

    });
}
