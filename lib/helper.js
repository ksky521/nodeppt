var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var win32 = process.platform === 'win32';
var pathSeparatorRe = /[\/\\]/g;

var $ = {
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

/**
 * 遍历
 * @param  {[type]}   rootdir       [description]
 * @param  {Function} callback      [description]
 * @param  {[type]}   subdir        [description]
 * @param  {[type]}   destDir       [description]
 * @param  {[type]}   judgeFunction [description]
 * @return {[type]}                 [description]
 */
$.recurse = function(rootdir, callback, subdir, destDir, judgeFunction) {
    var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
    judgeFunction = typeof judgeFunction === 'function' ? judgeFunction : function() {
        return true;
    };
    fs.readdirSync(abspath).forEach(function(filename) {
        var filepath = path.join(abspath, filename);
        if (fs.statSync(filepath).isDirectory() && judgeFunction(filename)) {
            $.mkdir(path.join(destDir, filename));
            $.recurse(rootdir, callback, unixifyPath(path.join(subdir, filename)), unixifyPath(path.join(destDir, filename)), judgeFunction);
        } else {
            judgeFunction(filename) && callback(unixifyPath(filepath), rootdir, subdir, filename, destDir, judgeFunction);
        }
    });

};

/**
 * 是否是目录
 * @param  {[type]}  dir        [description]
 * @param  {[type]}  notwarning [description]
 * @return {Boolean}            [description]
 */
$.isDir = function(dir, notwarning) {
    if (!fs.existsSync(dir)) {
        dir = path.join(process.cwd(), dir);
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
};

/**
 * 写文件
 * @param  {[type]} path    [description]
 * @param  {[type]} content [description]
 * @return {[type]}         [description]
 */
$.writeFile = function(path, content) {
    fs.writeFileSync(path, content, {
        encoding: 'utf-8'
    });
};
/**
 * 读取文件
 * @param  {[type]} filepath [description]
 * @return {[type]}          [description]
 */
$.readFile = function(filepath) {
    fs.readFileSync(filepath, 'utf8').toString();
};
/**
 * 路径复制
 * @param  {[type]} distDir       [description]
 * @param  {[type]} destDir       [description]
 * @param  {[type]} judgeFunction [description]
 * @return {[type]}               [description]
 */
$.copy = function(distDir, destDir, judgeFunction) {
    if (!(typeof judgeFunction === 'function')) {
        judgeFunction = function() {
            return true
        };
    }
    if ($.isDir(distDir, true)) {
        $.recurse(distDir, function(abspath, rootdir, subdir, filename) {
            var dest = path.join(destDir, (subdir ? subdir : ''));
            if (judgeFunction(filename, dest, subdir)) {
                if (!$.isDir(dest, true)) {
                    $.mkdir(dest);
                }
                if (filename) {
                    $.copy(abspath, path.join(dest, filename));
                } else {}
            }


        });
    } else {
        console.log(('路径 "' + distDir + '" 不存在！').red);
    }
};

/**
 * ejs渲染file
 * @param  {[type]} filepath [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
$.renderFile = function(filepath, data) {
    var str = $.readFile(filepath);
    return ejs.render(str, data || {});
};
/**
 * ejs渲染string
 * @param  {[type]} str  [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
$.renderStr = function(str, data) {
    return ejs.render(str, data);
};
/**
 * 创建目录
 * @param  {[type]} dirpath [description]
 * @param  {[type]} mode    [description]
 * @return {[type]}         [description]
 */
$.mkdir = function(dirpath, mode) {
    if (mode == null) {
        mode = parseInt('0777', 8) & (~process.umask());
    }
    dirpath.split(pathSeparatorRe).reduce(function(parts, part) {
        parts += part + '/';
        var subpath = path.resolve(parts);
        if (!$.exists(subpath)) {
            try {
                fs.mkdirSync(subpath, mode);
            } catch (e) {
                console.log('Unable to create directory "' + subpath + '" (Error code: ' + e.code + ').', e);
            }
        }
        return parts;
    }, '');
};

/**
 * 判断是否存在
 * @return {[type]} [description]
 */
$.exists = function() {
    var filepath = path.join.apply(path, arguments);
    return fs.existsSync(filepath);
};

module.exports = $;
