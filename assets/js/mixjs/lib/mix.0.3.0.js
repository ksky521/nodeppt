(function(window, undefined) {
'use strict';
var document = window.document;
var setTimeout = window.setTimeout;
//本js文件不支持defer等属性，否则计算当前路径会错误
//模块加载的东西，基础js肯定不能defer掉……
var curScriptNode = (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1]; //FF下可以使用DOC.currentScript
})();
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
//基本类型判断
'Function,String,Array,Number'.replace(/[^, ]+/g, function(t) {
    $['is' + t] = function(s) {
        return isType(s, t);
    }
});
if (typeof(/./) !== 'function') {
    $.isFunction = function(obj) {
        return typeof obj === 'function';
    };
}
$.isObject = function(obj) {
    return typeof obj === 'object';
}

$.isBoolean = function(obj) {
    return obj === true || obj === false || isType(obj, 'Boolean');
};

$.isUndefined = function(obj) {
    return obj === undefined;
};

/**
 * 获取类型
 * @param  {Object} obj 要判断的对象
 * @return {String}     返回类型
 */

function isType(obj, type) {
    return cleanObj.toString.call(obj).slice(8, -1) === type;
}
var UA = window.navigator.userAgent;

/**
 * Module类
 * @param {String} id      moduleID
 * @param {Array} deps    依赖模块
 * @param {Function} factory 工厂函数
 * @param {Object} root    相对定义的root
 */

function Module(id, deps, factory, root) {
    if (arguments.length === 0) {
        throw new Error('Module: I need a agrument');
    }
    if ($.isFunction(id)) {
        factory = id;
        id = undefined;
        deps = emptyArr;
    } else if ($.isArray(id)) {
        deps = emptyArr;
        id = undefined;
    } else if ($.isFunction(deps)) {
        factory = deps;
        deps = emptyArr;
    }
    this.id = id ? getPath(id)[2] : id;
    this.status = 'uninitialized';
    if ($.isString(deps)) {
        deps = deps.split(',');
    }
    this.dependencies = deps;
    this.factory = factory;
    this.root = root || _; //默认挂靠在window全局，使用_，默认挂靠到MixJS上
    this.undef = []; //没有定义的模块
    this.id && (mapDefined[this.id] = 'uninitialized');
    this.checkDependencies(deps);
    this.define();
}
Module.prototype = {
    constructor: Module,
    //定义
    define: function() {
        if (this.canDefine()) {
            this.namespace();
        } else if (this.status !== 'pending') {
            this.status = 'pending';
            this.id && (mapDefined[this.id] = this.status);
            this.loadDeps();
        }
    },
    //命名空间
    namespace: function() {
        var names = $.isString(this.id) ? this.id.split('/') : emptyArr;
        var root = this.root;
        var name, lastName;
        while (name = names.shift()) {
            lastName = name;
            if (names.length) {
                root = (root[name] = root[name] || {});
            }
        }
        try {
            var f = $.isFunction(this.factory) && this.factory.apply(window, this.getArgs());
            if (f) {
                f.amd = 'THEO'; //加个尾巴~
                root[lastName] = f;
                this.id && (mapDefined[this.id] = 'defined');
            }
        } catch (e) {
            if (this.id) {
                mapDefined[this.id] = 'error';
            }
            throw new Error('Module.namespace error:id=>' + this.id + ';undef=>' + this.undef.join(',') + ';info=>' + e.message);
        }
        //解决掉触发调用模块的promise
        if (this.id && $.isArray(mapDeps2ModulePromise[this.id])) {
            _.each(mapDeps2ModulePromise[this.id], function(v) {
                if (isPromise(v)) {
                    v.resolve();
                }
            });
        }
        this.destroy();
    },
    //根据模块名称，获取模块
    getFn: function(names) {
        names = names.split('/');
        var root = this.root;
        var name;
        while (name = names.shift()) {
            root = root[name];
        }
        return root;
    },
    //获取factory函数参数数组
    getArgs: function() {
        var arr = this.dependencies;
        var v;
        var fns = [this.root];
        for (var i = 0, len = arr.length; i < len; i++) {
            v = arr[i];
            fns.push(this.getFn(v));
        }
        return fns;
    },
    //判断是否符合转正标准
    canDefine: function() {
        var arr = this.undef;
        var len = arr.length;
        var temp;
        while (len--) {
            temp = arr[len];
            if (!defined(temp)) {
                if ((regIsCSS.test(temp) || regIsJS.test(temp)) && _.loaded(temp)) {
                    continue;
                }
                return false;
            }
        }
        return true;
    },
    //加载依赖
    loadDeps: function() {
        var self = this;
        var promise;
        var modules = self.undef;
        _.each(modules, function(v) {
            promise = new Promise();
            mapDeps2ModulePromise[v] = mapDeps2ModulePromise[v] ? mapDeps2ModulePromise[v] : [];
            mapDeps2ModulePromise[v].push(promise.done(function() {
                self.define();
            }));
            if (mapDefined[v] !== 'pending') {
                var alias = _.alias(v);

                if (alias && alias.length) {
                    //如果存在alias
                    var p = new Promise();

                    p.done(function() {
                        self.define()
                    });
                    //如果是普通js和css
                    //不支持有依赖关系的alias模块类型的js
                    var len = alias.length;
                    var cb = function() {
                        len--;
                        if (len === 0) {
                            mapDefined[v] = 'defined'; //标注alias被定义过了~
                            p.resolve();
                        }
                    };
                    _.each(alias, function(v) {
                        if (regIsCSS.test(v)) {
                            _.loadCSS(v, cb);
                        } else if (regIsJS.test(v)) {
                            _.loadJS(v, cb);
                        } else {
                            var tempPromise = new Promise();
                            mapDeps2ModulePromise[v] = mapDeps2ModulePromise[v] ? mapDeps2ModulePromise[v] : [];
                            mapDeps2ModulePromise[v].push(tempPromise.done(cb));
                            _.loadJS(v);
                        }
                    });
                } else if (regIsCSS.test(v)) {
                    //css文件
                    _.loadCSS(v, function() {
                        self.define();
                    });
                } else if (regIsJS.test(v)) {
                    //js文件
                    _.loadJS(v, function() {
                        self.define();
                    });
                } else {
                    //模块
                    _.loadJS(v);
                }
            }
        });
    },
    //首次检测依赖关系，对已经定义和未定义的模块进行分组
    checkDependencies: function(deps) {
        var self = this;
        _.each(deps, function(v) {
            v = getPath(v)[2];
            if (!defined(v)) {
                self.undef.push(v);
            }
        });
    },
    //销毁函数
    destroy: function() {
        destroy(this);
    }
};

/**
 * 判断是否为amd模块
 * @param  {Object}  obj 要判断的对象
 * @return {Boolean}     判断结果
 */

function isAMD(obj) {
    return obj.amd === 'THEO';
}

/**
 * 判断一个module是否被定义过
 * @param  {String} moduleID 被检测的module对象id
 * @return {Boolean}        判断结果
 */

function defined(moduleID) {
    return mapDefined[moduleID] === 'defined';
}
/**
 * Promise类
 */

function Promise() {
    this.status = 'unfulfilled'; //fulfilled|failed
    this.fulfilledHandlers = [];
    this.errorHandlers = [];
    this.reason = '';
}
Promise.prototype = {
    constructor: Promise,
    reject: function(arg) {
        if (this.status !== 'unfulfilled') {
            return this;
        }
        this.reason = arg;
        this.status = 'failed';
        return this.fire(this.errorHandlers, arg);
    },
    isResolved: function() {
        return this.status === 'fulfilled';
    },
    resolve: function(arg) {
        if (this.status !== 'unfulfilled') {
            return this;
        }
        this.reason = arg;
        this.status = 'fulfilled';
        return this.fire(this.fulfilledHandlers, arg);
    },
    fail: function(handler) {
        return this.then(undefined, handler);
    },
    always: function(handler) {
        return this.then(handler, handler);
    },
    then: function(fulfilledHandler, errorHandler) {
        switch (this.status) {
        case 'unfulfilled':
            this.add(fulfilledHandler, 'fulfilled')
                .add(errorHandler, 'error');
            break;
        case 'fulfilled':
            this.fire(fulfilledHandler, this.reason);
            break;
        case 'failed':
            this.fire(errorHandler, this.reason);
        }
        return this;
    },
    done: function(handler) {
        return this.then(handler);
    },
    fire: function(fns, arg) {
        if ($.isArray(fns)) {
            var fn;
            while (fn = fns.shift()) {
                if ($.isFunction(fn)) {
                    fn(arg);
                }
            }
            this.clear();
        } else if ($.isFunction(fns)) {
            fns(arg);
        }
        return this;
    },
    add: function(handler, which) {
        which = which + 'Handlers';
        if ($.isFunction(handler) && this[which]) {
            this[which].push(handler);
        }
        return this;
    },
    clear: function() {
        this.fulfilledHandlers.length = 0;
        this.errorHandlers.length = 0;
    }
};

/**
 * 是否是Promise实例
 * @param  {Object}  o 被检验的对象
 * @return {Boolean}   是否为实例
 */

function isPromise(o) {
    return o instanceof Promise;
}
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
    src = script.src = urls[0];
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

var _ = {
    version: VERSION,
    mix: mix,
    indexOf: function(array, item, isSorted) {
        if (array == null) {
            return -1;
        }
        var i = 0;
        var l = array.length;
        if (isSorted) {
            i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
        }
        if (emptyArr.indexOf && array.indexOf === emptyArr.indexOf) {
            return array.indexOf(item, isSorted);
        }
        for (; i < l; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    },
    /**
     * 数组遍历
     * @param  {Array}   arr      数组
     * @param  {Function} callback 处理函数
     * @param  {Object}   scope    处理上下文
     */
    each: emptyArr.forEach ? function(arr, callback, scope) {
        emptyArr.forEach.call(arr, callback, scope);
    } : function(arr, callback, scope) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (i in arr) {
                callback.call(scope, arr[i], i, arr);
            }
        }
    },
    defined: defined,
    define: function(mid, dependencies, factory) {
        new Module(mid, dependencies, factory);
        return this;
    },
    /**
     * use方法
     * @param  {Array}   mid      模块数组
     * @param  {Function} callback 回调函数
     * @return {Object}            返回promise对象
     */
    use: function(mid, callback) {
        new Module(undefined, mid, callback);
        return this;
    },
    /**
     * 基本设置
     * @param  {Object|undefined} cfg 设置，为空则返回
     * @return {Object}
     */
    config: function(cfg) {
        if ($.isObject(cfg)) {

            mix(defaultConfig, cfg);
            return this;
        }
        return defaultConfig;
    },
    /**
     * 判断path是否加载
     * @param  {String} path 路径
     * @return {Boolean}     是否加载完成
     */
    loaded: function(path) {
        path = getPath(path)[0];
        return _.status(path) === 'loaded';
    },
    /**
     * 查询路径的加载状态
     * @param  {String} path 查询的路径
     * @return {String}      返回状态：pending|error|loaded|timeout
     */
    status: function(path) {
        return mapLoaded[path];
    },
    /**
     * 别名机制
     * @param  {String} name 名字
     * @param  {String} realpath  别名真实url
     * @return {[type]}      [description]
     */
    alias: function(name, realpath) {
        if (regAlias.test(name)) {
            if ($.isUndefined(realpath)) {
                return mapAlias[name];
            }
            mapAlias[name] = String(realpath).split(',');
        } else if ($.isObject(name)) {
            realpath = name.path;
            name = name;
            _.alias(name, realpath);
        }
    },
    loadJS: loadJS,
    loadCSS: loadCSS,
    Promise: Promise,
    isAMD: isAMD
};

/**
 * 销毁函数
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */

function destroy(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i) && obj[i]) {
            if ($.isArray(obj[i])) {
                obj[i].length = 0;
            }
            if ($.isFunction(obj[i].destroy)) {
                obj[i].destroy();
            }
            delete obj[i];
        }
    }
}

/**
 * 混合杂糅
 * @param  {Object} target 目标对象，以此为基础的对象
 * @param  {Object} source 来源对象
 * @param  {Boolean} ride  是否覆盖同名属性
 * @return {Object}        处理完的对象
 */

function mix(target, source, ride) {
    var args = arrSlice.call(arguments);
    var i = 1;
    var key;
    //如果最后参数是布尔，判定是否覆写同名属性
    ride = $.isBoolean(ride) ? ride : true;

    while ((source = args[i++])) {
        //source = [{a:1},{b:3}];
        if ($.isArray(source)) {
            for (var n = 0, len = source.length; n < len; n++) {
                mix(target, source[n], ride);
            }
            continue;
        }
        //杂糅只允许对象
        for (key in source) {
            if (ride || !(key in target)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}



if ($.isUndefined(window.define)) {
    window.define = _.define;
}
window.MixJS = mix(_, $);
}(this));