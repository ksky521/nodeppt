//本js文件不支持defer等属性，否则计算当前路径会错误
//模块加载的东西，基础js肯定不能defer掉……
var curScriptNode = (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1]; //FF下可以使用DOC.currentScript
})();