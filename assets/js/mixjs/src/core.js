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