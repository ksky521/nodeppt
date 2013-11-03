var fs = require('fs');
var path = require('path');
var join = path.join;
var grunt = require('grunt');
var gFile = grunt.file;
var gTpl = grunt.template;
var color = require('colors');
var read = require('read');
var exec = require('child_process').exec;
var win32 = process.platform === 'win32';

module.exports = {
    isDir: isDir,
    writeFile: writeFile,
    recurse: recurse,
    getDirPath: function(dir) {
        dir += path.sep;
        try {
            dir = fs.realpathSync(dir) + path.sep;
        } catch (e) {}
        return dir;
    }
};
var unixifyPath = function(filepath) {
    if (win32) {
        return filepath.replace(/\\/g, '/');
    } else {
        return filepath;
    }
};

function recurse(rootdir, callback, subdir, destDir, judgeFunction) {
    var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
    judgeFunction = typeof judgeFunction === 'function' ? judgeFunction : function() {
        return true;
    };
    fs.readdirSync(abspath).forEach(function(filename) {
        var filepath = path.join(abspath, filename);
        if (fs.statSync(filepath).isDirectory() && judgeFunction(filename)) {
            grunt.file.mkdir(path.join(destDir, filename));
            recurse(rootdir, callback, unixifyPath(path.join(subdir, filename)), unixifyPath(path.join(destDir, filename)), judgeFunction);
        } else {
            judgeFunction(filename) && callback(unixifyPath(filepath), rootdir, subdir, filename, destDir, judgeFunction);
        }
    });

}

function isDir(dir, notwarning) {
    if (!fs.existsSync(dir)) {
        dir = join(process.cwd(), dir);
        if (!fs.existsSync(dir)) {

            if (!notwarning) {
                console.log('ERROR: '.bold.red + dir + ' 不是一个正确路径');
            }
            return false;
        }

    } else {
        var stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            if (!notwarning) {
                console.log('ERROR: '.bold.red + dir + ' 不是一个正确路径');
            }
            return false;
        }
    }
    return true;
}

function writeFile(path, content) {
    gFile.write(path, content, {
        encoding: 'utf-8'
    });
}
