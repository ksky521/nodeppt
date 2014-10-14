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