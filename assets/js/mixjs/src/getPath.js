/**
 * 获取真实url
 * 来自massframework
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */

function getPath(url, root) {
    var ret = url;
    var tmp;
    var _2;
    var alias = _.alias;
    var id;
    root = root || defaultConfig.baseURL;
    root = root.substr(0, root.lastIndexOf('/'));
    id = url; //模块id

    if (regAlias.test(url) && alias[url]) {
        ret = alias[url];

    } else if (/^(\w+)(\d)?:.*/.test(url)) { //如果用户路径包含协议
        ret = url;
    } else {
        tmp = url.charAt(0);
        _2 = url.slice(0, 2);

        if (tmp !== '.' && tmp !== '/') { //相对于根路径
            ret = root + '/' + url;
        } else if (_2 === './') { //相对于兄弟路径
            id = url.substr(2);
            ret = root + '/' + id;
        } else if (_2 === '..') { //相对于父路径
            // var arr = root.replace(/\/$/, '').split('/');
            var arr = root.split('/');
            tmp = url.replace(/\.\.\//g, function() {
                arr.pop();
                return '';
            });
            id = tmp;
            ret = arr.join('/') + '/' + tmp;
        }
    }

    var ext = 'js'; //默认是js文件
    tmp = ret.replace(/[?#].*/, '');
    if (/\.(\w+)$/.test(tmp)) {
        ext = RegExp.$1;
    }
    if (ext !== 'css' && tmp === ret && !regIsJS.test(ret)) { //如果没有后缀名会补上.js
        ret += '.js';
    }
    return [ret, ext, id];
}