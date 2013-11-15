var fs = require('fs');
var path = require('path');

var libDir = __dirname + path.sep;
var $ = require('./helper');
var rootDir = path.join(libDir, '../') + path.sep;

module.exports = function(destDir) {
    destDir = $.getDirPath(destDir);
    var assetsDir = rootDir + 'assets';
    //复制assets文件夹
    $.copy(assetsDir, path.join(destDir, 'assets'), function(filename, dir, subdir) {
        if (!subdir) {

            return false;
        }
        return true;
    });
    //复制template文件夹
    $.copy(rootDir + 'template', path.join(destDir, 'template'), function(filename, dir, subdir) {
        if (!subdir && filename === 'default.ejs') {
            return false;
        }
        return true;
    });
    //复制ppts文件夹
    $.copy(rootDir + 'ppts', path.join(destDir, 'ppts'), function(filename, dir, subdir) {
        if (!subdir && filename === 'demo.html') {
            return false;
        }
        return true;
    });

    //复制config.json
    ['config.json'].map(function(filename) {
        filepath = rootDir + filename;
        $.copy(filepath, path.join(destDir, filename));
    });
}
