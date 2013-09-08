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