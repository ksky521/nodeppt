var VERSION = 'MixJS 0.3 butterfly';
var emptyFn = function() {};
var cleanObj = {};
var emptyArr = [];
var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
var base = head.getElementsByTagName('base')[0] || null;
var arrSlice = emptyArr.slice;

//获取当前文件父路径
var PATH = (function(node) {
    var url = node.hasAttribute ? node.src : node.getAttribute('src', 4);
    return url.substr(0, url.lastIndexOf('/')) + '/';
})(curScriptNode);

//是否为js
var regIsJS = /\.js$/i;
//是否为css
var regIsCSS = /\.css$/i;
//alias
var regAlias = /^[-\w\d_$]{2,}$/i;
var $ = {};

var defaultConfig = {
    timeout: 2E4, //超时时间二十秒
    baseURL: PATH,
    charset: 'utf-8'
};

//=============>maps
//别名列表
var mapAlias = {};
//加载完的文件列表
var mapLoaded = {};
//已经定义模块的状态表：undefined|pending|defined
var mapDefined = {};
//通过依赖找上一级模块的promise
var mapDeps2ModulePromise = {};