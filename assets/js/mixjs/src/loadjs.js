/**
 * 加载js
 * @param  {String}   src      路径
 * @param  {Function} callback 回调函数
 * @param  {Object}   attrs    attribute对象
 * @param  {Number}   timeout  超时时间
 * @param  {Function}   error  出错函数
 * @param  {Function}   complete  完成函数，出错和load都执行的
 * @return {Object}            this
 */
function loadJS(src, callback, attrs, timeout, fail, complete) {
    if ($.isObject(src)) {
        callback = src.callback;
        attrs = src.attrs;
        timeout = src.timeout;
        fail = src.fail;
        complete = src.complete;
        src = src.src;
        return loadJS(src, callback, attrs, timeout, fail, complete);
    }
    var script = document.createElement('script');
    var done = false;
    if ($.isObject(attrs)) {
        for (var i in attrs) {
            script.setAttribute(i, attrs[i]);
        }
    }
    var urls = getPath(src);
    src = script.src = urls[0].replace('//', '/');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = defaultConfig.charset;
    complete = $.isFunction(complete) ? complete : emptyFn;
    script.onload = script.onreadystatechange = function(e) {
        e = e || cleanObj
        if (!done && (e.type === 'load' || /loaded|complete|undefined/.test(script.readyState))) {
            done = true;
            removeNode(script);
            mapLoaded[src] = 'loaded';
            $.isFunction(callback) && callback();
            complete('load');
        }
    };
    script.onerror = function() {
        done = true;
        mapLoaded[src] = 'error';
        $.isFunction(fail) && fail();
        complete('error');
    };
    timeout = $.isNumber(timeout) ? timeout : defaultConfig.timeout;
    if (timeout) {
        setTimeout(function() {
            if (!done) {
                done = true;
                mapLoaded[src] = 'timeout';
                complete('timeout');
            }
        }, timeout);
    }
    mapLoaded[src] = 'pending';
    head.insertBefore(script, base);
    return _;
}
/**
 * 移出node节点，释放内存
 * @param  {Element} node 节点
 */
function removeNode(node) {
    //确保执行一次+内存回收
    node.onload = node.onerror = node.onreadystatechange = null;
    if (node.parentNode) {
        setTimeout(function() {
            node.parentNode.removeChild(node);
            node = null;
        }, 0);
    }
}
