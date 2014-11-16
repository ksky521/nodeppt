var fs = require('fs');
var path = require('path');

var md_parser = require('./md_parser');
var $ = require('./helper');
var rootDir = path.join(__dirname, '../') + path.sep;
var assetsDir = path.join(rootDir, 'assets') + path.sep;
var templateDir = path.join(rootDir, 'template') + path.sep;

//1. 只导出文件nodeppt generate file.md
//2. 导出文件+目录 nodeppt generate ./ --all -o publish
module.exports = function(filepath, outputDir, isAll) {
    filepath = fs.realpathSync(filepath);
    outputDir = outputDir ? $.getDirPath(outputDir) : $.getDirPath(path.join(process.cwd(), './publish'));
    isAll = !!isAll;
    if (isAll) {
        //1.导出assets
        $.copy(assetsDir, outputDir, function(filename, dir, subdir) {
            if (!subdir || subdir === 'scss') {
                //不复制scss
                return false;
            }
            return true;
        });
    }
    //2.导出复制filepath除根目录下img、css和js等到assets，遇见/*.md就解析
    generate(filepath, outputDir);
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
function generate(filepath, outputDir) {
    var filename = '';
    var templateMd = $.readFile(templateDir + 'markdown.ejs');
    var templateList = $.readFile(templateDir + 'list.ejs');


    if ($.isDir(filepath, true)) {
        //遍历目录生成htm
        var indexList = '';
        $.copy(filepath, outputDir, function(filename, dir, subdir) {

            if (!subdir && /\.(?:md|markdown)$/i.test(filename)) {
                var content = $.readFile(path.join(filepath, filename));
                var html = parser(content);
                if (html) {
                    var title = html.match(/<title>(.*?)<\/title>/);
                    if (title[1]) {
                        title = title[1];
                    } else {
                        title = filename;
                    }

                    var url = filename.replace(/\.(?:md|markdown)$/i, '.htm');
                    indexList += '<li><a class="star" href="' + url + '" target="_blank">' + title + '</a> &nbsp; [<a href="' + url + '?_multiscreen=1" target="_blank" title="多窗口打开">多窗口</a>]</li>';

                    copyLinkToOutput(content, filepath, outputDir);

                    html = handlerHTML(html);

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
        if ($.exists(filepath)) {
            content = $.readFile(filepath);
        } else {
            return console.log('ERROR: '.bold.red + filepath + ' is not exists!');
        }
        filename = path.basename(filepath);
        copyLinkToOutput(content, filepath, outputDir);
        var html = parser(content);
        if (html) {
            html = handlerHTML(html);
            $.writeFile(path.join(outputDir, filename.replace(/\.(?:md|markdown)$/i, '.htm')), html);
        }
    }
}

//处理绝对路径的url
function handlerHTML(html) {
    html = html.replace(/([src|href])=["']\//gi, '$1="./')
        .replace("loadJS('/js", "loadJS('./js").replace("dir: '/js/',", "dir: './js/',");
    return html;
}
//处理页面相对url，到目标文件夹
function copyLinkToOutput(content, filepath, outputDir) {
    //[inline模式](/assets/box-fe-road/img/inline-mode.png)
    var files = [];
    content.replace(/\[.+?\]\(\s?(.*?)\s?\)/g, function(i, file) {
        files.push(file);
    }).replace(/href=(['"])(.+?)\1/g, function(i, q, file) {
        files.push(file);
    });
    //解析cover
    var json = md_parser.parseCover(content.split(/\[slide.*\]/i)[0]);
    if (json.files) {
        files = files.concat(json.files.split(/\s?,\s?/));
    }
    files.filter(function(f) {
        return !/^http[s]?:\/\//.test(f);
    }).forEach(function(f) {
        var topath = path.join(outputDir, f);
        var realpath = path.join(path.dirname(filepath), f);
        if ($.exists(realpath)) {
            var data = fs.readFileSync(String(realpath));
            $.writeFile(topath, data);
        }

    });
}
