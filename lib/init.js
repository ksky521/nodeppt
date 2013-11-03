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
    $.copy(assetsDir, path.join(destDir, 'assets'), function(filename, dir, subdir) {
        if (!subdir && filename === 'default.tpl') {

            return false;
        }
        return true;
    });

    $.copy(rootDir + 'ppts', path.join(destDir, 'ppts'), function(filename, dir, subdir) {
        if (!subdir && filename === 'demo.html') {
            return false;
        }
        return true;
    });

    ['config.json'].map(function(filename) {
        filepath = rootDir + filename;
        gFile.copy(filepath, path.join(destDir, filename));
    });
}
