var fs = require('fs');
var path = require('path');

var md_parser = require('./md_parser');
var $ = require('./helper');
var rootDir = path.join(__dirname, '../') + path.sep;
var staticDir = path.join(rootDir, 'assets') + path.sep;
var templateDir = path.join(rootDir, 'template') + path.sep;

module.exports = {
    dir: function(destDir, outputDir) {
        destDir = $.getDirPath(destDir);
        if (!fs.existsSync(destDir + 'config.json')) {
            console.log('ERROR: '.red + ' not found config.json!');
            return;
        }
        outputDir = outputDir ? $.getDirPath(outputDir) : $.getDirPath(path.join(process.cwd(), './publish'));
        var config = require(destDir + 'config.json');
        var defaultConfig = require(rootDir + 'config.json');
        var assetsDir = config.assetsDir ? path.join(destDir, config.assetsDir) : defaultConfig.assetsDir;
        var pptDir = config.pptDir ? path.join(destDir, config.pptDir) : defaultConfig.pptDir;
        var template = {
            'markdown.ejs': '',
            'list.ejs': ''
        };
        //复制assets文件夹内容
        $.copy(assetsDir, outputDir, function(filename, dir, subdir) {
            if (subdir === 'scss') {
                //不复制scss
                return false
            }
            if (!subdir && /\.tpl$/i.test(filename)) {
                if (filename in template) {
                    template[filename] = fs.readFileSync(path.join(assetsDir, filename), 'utf-8').toString();
                }

                //不复制根目录下面的tpl文件
                return false;
            }
            return true;
        });

        var indexList = '';
        //复制ppts内容
        $.copy(pptDir, outputDir, function(filename, dir, subdir) {

            if (!subdir && /\.(?:md|markdown)$/i.test(filename)) {
                var html = parser(path.join(pptDir, filename), template['markdown.ejs']);
                if (html) {
                    var title = html.match(/<title>(.*?)<\/title>/);
                    if (title[1]) {
                        title = title[1];
                    } else {
                        title = filename;
                    }

                    var url = filename.replace(/\.(?:md|markdown)$/i, '.htm');
                    indexList += '<li><a class="star" href="' + url + '" target="_blank">' + title + '</a> &nbsp; [<a href="' + url + '?_multiscreen=1" target="_blank" title="多窗口打开">多窗口</a>]</li>';

                    $.writeFile(path.join(outputDir, filename.replace(/\.(?:md|markdown)$/i, '.htm')), html);
                }

                //不复制根目录下面的tpl文件
                return false;
            }
            return true;
        });

        //输出index文件
        var packageJson = require(path.join(__dirname, '../package.json'));

        var data = {
            version: packageJson.version,
            site: packageJson.site,
            date: Date.now(),
            list: indexList,
            dir: '/'
        };

        indexList = $.renderStr(template['list.ejs'] || $.readFile(templateDir + 'list.ejs'), {
            data: data
        });
        $.writeFile(path.join(outputDir, 'index.html'), indexList);

        console.log('生成结束！'.green);
    },
    output: function(filename) {
        var html = parser(filename);
        if (html) {
            $.writeFile(filename.replace(/\.(?:md|markdown)$/i, '.htm'), html);
        }
    }
};

function parser(realPath, template) {
    if ($.exists(realPath)) {
        var content = $.readFile(realPath);
        try {
            var html = md_parser(content, null, template);
            return html;
        } catch (e) {
            console.log('ERROR: '.red + e.toString());
        }
    } else {
        console.log('ERROR: '.red + realPath + ' is not exists!');
    }
    return false;
}
