//放弃轮询方法，改用img的方法，对于不支持的古老级别浏览器自动屏蔽
/**
 * 加载css
 * @param  {String}   href     路径
 * @param  {Function} callback 回调函数
 * @param  {Object}   attrs    attribute对象
 * @param  {Number}   timeout  超时时间
 * @param  {Function}   error  出错函数
 * @param  {Function}   complete  完成函数，出错和load都执行的
 * @return {Object}            this
 */

function loadCSS(href, callback, attrs, timeout, fail, complete) {
    if ($.isObject(href)) {
        callback = href.callback;
        attrs = href.attrs;
        timeout = href.timeout;
        fail = href.fail;
        complete = href.complete;
        href = href.href;
        return loadCSS(href, callback, attrs, timeout, fail, complete);
    }
    var link = document.createElement('link');
    var done = false;
    

    timeout = $.isNumber(timeout) ? timeout : defaultConfig.timeout;

    var url = getPath(href);
    href = link.href = url[0];
    link.rel = 'stylesheet';
    link.type = 'text/css';

    
    if ($.isObject(attrs)) {
        for (var i in attrs) {
            link.setAttribute(i, attrs[i]);
        }
    }
    //弱化css 错误处理，只有callback的时候才处理
    if($.isFunction(callback)){
        complete = $.isFunction(complete) ? complete : emptyFn;
        var cb,err;
        cb = function() {
            if (!done) {
                done = true;
                link.onload = link.onerror = link.onreadystatechange = null;
                mapLoaded[href] = 'loaded';
                $.isFunction(callback) && callback();
                complete('load');
            }
        }
        if($.isFunction(fail)){
            err = function() {
                if (!done) {
                    done = true;
                    link.onload = link.onerror = link.onreadystatechange = null;
                    mapLoaded[href] = 'error';
                    fail();
                    complete('error');
                }
            }
        }

        cssCallback(link, cb, err);
        if (timeout) {
            setTimeout(function() {
                if (!done) {
                    done = true;
                    mapLoaded[href] = 'timeout';
                    complete('timeout');
                }
            }, timeout);
        }
    }
    
    mapLoaded[href] = 'pending';
    head.insertBefore(link, base);
    return _;
}

// `onload` event is supported in WebKit since 535.23
// Ref:
//  - https://bugs.webkit.org/show_activity.cgi?id=38995
var isOldWebKit = Number(UA.replace(/.*AppleWebKit\/(\d+)\..*/, '$1')) < 536;
// `onload/onerror` event is supported since Firefox 9.0
// Ref:
//  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
//  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
var isOldFirefox = ~UA.indexOf('Firefox') && !('onload' in document.createElement('link'));

var cssCallback = (isOldWebKit || isOldFirefox) ? function(node, callback) {
        if ($.isFunction(callback)) {
            var img = new Image();
            img.src = node.href;
            img.error = callback;            
        }
    } : function(node, callback, fail) {
        if ($.isFunction(callback)) {
            node.onload = function() {
                callback();
            }
        }
        if ($.isFunction(fail)) {
            node.onerror = function() {
                fail();
            }
        }
    };
