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