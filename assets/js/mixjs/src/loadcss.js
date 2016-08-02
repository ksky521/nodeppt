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
    complete = $.isFunction(complete) ? complete : emptyFn;
    if ($.isObject(attrs)) {
        for (var i in attrs) {
            link.setAttribute(i, attrs[i]);
        }
    }
    var cb = function() {
        if (!done) {
            done = true;
            link.onload = link.onerror = link.onreadystatechange = null;
            mapLoaded[href] = 'loaded';
            $.isFunction(callback) && callback();
            complete('load');
        }
    }
    var err = function() {
        done = true;
        link.onload = link.onerror = link.onreadystatechange = null;
        mapLoaded[href] = 'error';
        $.isFunction(fail) && fail();
        complete('error');
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
    mapLoaded[href] = 'pending';
    head.insertBefore(link, base);
    return _;
}

//为了保证每个poll的重试次数为300
var pollTimers = {};
///css load检测来自seajs
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
        // Begin after node insertion
        if ($.isFunction(callback)) {
            //设置timer
            pollTimers[node.href] = 0;
            setTimeout(function() {
                poll(node, callback);
            }, 50);
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

function poll(node, callback) {
    var done = false;
    var count = pollTimers[node.href]++;
    if (count > 300) {
        callback();
        done = true;
        return;
    }
    // for WebKit < 536
    if (isOldWebKit) {
        if (node.sheet) {
            done = true;
        }
    }
    // for Firefox < 9.0
    else if (node.sheet) {
        try {
            if (node.sheet.cssRules) {
                done = true;
            }
        } catch (ex) {
            // The value of `ex.name` is changed from
            // 'NS_ERROR_DOM_SECURITY_ERR' to 'SecurityError' since Firefox 13.0
            // But Firefox is less than 9.0 in here, So it is ok to just rely on
            // 'NS_ERROR_DOM_SECURITY_ERR'
            if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
                done = true;
            }
        }
    }
    setTimeout(function() {
        if (done) {
            // Place callback in here due to giving time for style rendering.
            callback();
        } else {
            poll(node, callback);
        }
    }, 50)
}