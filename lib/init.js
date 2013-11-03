var fs = require('fs');
var path = require('path');
var grunt = require('grunt');
var gFile = grunt.file;

var libDir = __dirname + '/';
var $ = require(libDir + '/' + 'helper');

var rootDir = path.join(libDir, '../') + '/';

module.exports = function(destDir) {
    destDir = $.getDirPath(destDir);
    var assetsDir = rootDir + 'assets';
    copy(assetsDir, path.join(destDir, 'assets'));

    ['ppts/demo.md', 'config.json'].map(function(filename) {
        filepath = rootDir + filename;
        gFile.copy(filepath, path.join(destDir, filename));
    });
}


function copy(distDir, destDir) {
    if (gFile.isDir(distDir)) {
        gFile.recurse(distDir, function(abspath, rootdir, subdir, filename) {
            var dest = path.join(destDir, (subdir ? subdir : ''));
            if (!gFile.isDir(dest)) {
                gFile.mkdir(dest);
            }
            if (filename) {
                var destFile = path.join(dest, filename);
                gFile.copy(abspath, destFile);
            } else {}

        });
    } else {
        console.log(('路径 "' + distDir + '" 不存在！').red);
    }
}
