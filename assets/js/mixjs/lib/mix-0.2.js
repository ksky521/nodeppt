;(function(global, DOC, undefined) {
    var VERSION = '0.2',
        curScriptNode = (function(scripts, node) {
            scripts = DOC.getElementsByTagName('script');
            node = scripts[scripts.length - 1]; //FF下可以使用DOC.currentScript
            return node;
        })(),
        isDebug = !! curScriptNode.getAttribute('debug'),
        MixJSName = curScriptNode.getAttribute('name') || 'MixJS',
        CHARSET = curScriptNode.getAttribute('charset') || 'utf-8',

        //获取当前文件父路径
        PATH = (function(node) {
            var url = node.hasAttribute ? // non-IE6/7
            node.src :
            // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
            node.getAttribute('src', 4);
            return url.substr(0, url.lastIndexOf('/')) + '/';
        })(curScriptNode),
        HEAD = DOC.head || DOC.getElementsByTagName('head')[0] || DOC.documentElement,
        BASEELEMENT = HEAD.getElementsByTagName('base')[0] || null,
        UA = navigator.userAgent,
        isWebKit = ~UA.indexOf('AppleWebKit'),

        reg = /[^, ]+/g,

        _cleanObj = {},
        _emptyArr = [],
        _emptyFn = function() {},
        _arrSlice = _emptyArr.slice,
        /**
         * 数组遍历
         * @param  {[type]}   arr      [description]
         * @param  {Function} callback [description] arrvalue index arr
         * @param  {[type]}   scope    [description]
         * @return {[type]}            [description]
         */
        each = [].forEach ?
            function(arr, callback, scope) {
                [].forEach.call(arr, callback, scope);
            } : function(arr, callback, scope) {
                for(var i = 0, len = arr.length; i < len; i++) {
                    if(i in arr) {
                        callback.call(scope, arr[i], i, arr);
                    }
                }
            };

    var config = {
            path: PATH,
            perload: _emptyArr,
            //预先加载库
            debug: isDebug,
            charset: CHARSET
        },
        alias = {},
        regAlias = /^[-\w\d_$]{2,}$/i,
        _moduleDepsMap = {},
        _filesMap = {},
        //1:加载之前，2:加载中，3:加载完成
        _modulesMap = {}; //1：定义之前 2：等待依赖关系中 3：定义完成
    var $ = {
        VERSION: VERSION,
        path:PATH,
        /**
         * 别名机制
         * @param  {String} name 名字
         * @param  {String} realpath  别名真实url
         * @return {[type]}      [description]
         */
        alias: function(name,arr){
            if(regAlias.test(name)){
                if($.isUndefined(arr)){
                    return alias[name];
                }else{
                    arr = String(arr);
                    alias[name] = arr;
                    return this;
                }

            }else{
                throw new Error('MixJS.alias name 格式错误');
            }
            return this;
        },
        use: function(names, callback) {
            names = dealArr(names);
            if(names.length === 0) {
                $.isFunction(callback) && callback();
                return this;
            }
            var temp = [], self = this;
            each(names, function(v) {
                var arr = getPath(v),
                    ext = arr[1],
                    moduleId = arr[2],
                    url = arr[0];
                    
                if(!defined(moduleId) || (ext==='css' && _filesMap[url]===3)) {
                    temp.push(moduleId);
                    
                   
                    var cb = function() {
                        //_modulesMap[v] = 3;
                        _filesMap[url] = 3;
                        temp.pop();

                        if(temp.length === 0) {
                            var t = function() {
                                    
                                    if(defined(moduleId) || ext==='css') {

                                        $.isFunction(callback) && callback(self);

                                    } else {
                                        var q = Queue.useCallback[moduleId];
                                        q = q ? q : (Queue.useCallback[moduleId] = new Queue(moduleId));
                                        // console.log(q);
                                        q.push(arguments.callee);

                                    }
                                }
                            t();
                            temp = null;
                        }
                    };
                    // console.log(arr);
                    ext==='css'?loadCSS(url,cb):loadJS(url, cb);
                }

            });
            return this;
        },
        define: function(name, deps, factory) {
            if(!$.isString(name)) {
                throw new Error('MixJS.define: name 必须为字符串');
            }
            if($.isFunction(deps)) {
                factory = deps;
                deps = _emptyArr;
            } else {
                deps = dealArr(deps, 'define', name);
            }

            _moduleDepsMap[name] = deps;

            new Module(name, deps, factory)
            return this;
        },
        config: function(cfg) {

            config = mix(config, cfg);
            return this;
        },
        loadJS:loadJS,
        loadCSS:loadCSS,
        defined: defined,
        loaded: function(file) {
            var url = getPath(file)[0];
            return loaded(url);
        },
        mix: mix,
        each: each,
        noConflict:function(){
            return this;
        }
    };



    //基本类型判断
    'Function,String,Array,Number'.replace(reg, function(t) {
        $['is' + t] = function(s) {
            return isType(s, t)
        }
    });

    if(typeof(/./) !== 'function') {
        $.isFunction = function(obj) {
            return typeof obj === 'function';
        };
    }   


    $.isBoolean = function(obj) {
        return obj === true || obj === false || isType(obj,'Boolean')
    };

    $.isUndefined = function(obj) {
        return obj === undefined;
        //return obj === void 0;
    };


    //释放到window
    global[MixJSName] = $;
    MixJSName !== 'MixJS' && (global.MixJS = $);

    /**
     * 判断模块是否定义
     * @param  {[type]} module [description]
     * @return {[type]}        [description]
     */

    function defined(module) {

        return _modulesMap[module] === 3;
    }
    /**
     * 判断文件是否加载
     * @param  {[type]} file [description]
     * @return {[type]}      [description]
     */

    function loaded(file) {

        return _filesMap[file] === 3;
    }


    /**
     * 数组去重复项和去除空项
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */

    function dealArr(arr, isFromDefine, mName) {
        arr = String(arr).split(',');
        var len = arr.length;
        if(len === 0) {
            return arr[0] === '' ? _emptyArr : arr;
        }
        var back = [],
            obj = {},
            val;
        for(var i = 0; i < len; i++) {
            val = arr[i];

            if(val !== '' && !obj[val]) {
                obj[val] = 1;
                back.push(val);

                isFromDefine === 'define' && (Module.parentModule[val] = mName); //定义父模块               
            }
        }
        obj = null;
        return back;
    }


    /**
     * 检测依赖关系是否都加载完成
     * _moduleDepsMap = {
     *     test.a:[a,b,c]
     *     a:[d,e]
     * }
     * @return {[type]} [description]
     */

    function checkDeps(module) {
        var arr = _moduleDepsMap[module];
        
        if(!arr || arr.length===0) {
            return true;
        }
        var obj = {},
            back = true;

        for(var i = 0, len = arr.length; i < len; i++) {
            var m = arr[i];
            
            if(m===module){
                throw new Error(module + '： 发现循环依赖');
            }
            if(obj[m] === 1) {
                //简单去重，不能保证二次依赖去重复
                continue;
            }
            
            if(regAlias.test(m) && alias[m]){
                //如果是alias模块
                if(loaded(alias[m])){
                    obj[m] = 1;
                    continue;
                }
                back = false;
                break;
            }
            
            if(regISCSS.test(m)){
                //如果是css文件
                if(loaded(getPath(m)[0])){
                    obj[m] = 1;
                    continue;
                }
                back = false;
                break;             
            }

            var temp = _moduleDepsMap[m];

            if(temp && !(back = checkDeps(m))) {

                break;

            } else if(!defined(m)) {
                back = false;
                break;
            } else {
                obj[m] = 1;
            }
        }
        obj = null;
        return back;
    }

    var _waitModule = {}; //等待转正的module实例
    /**
     * 模块类
     * @param {[type]} id    模块名称
     * @param {Array} deps  依赖模块
     * @param {[type]} maker 制造函数
     * @param {[type]} root  父模块，默认是MixJS
     */

    function Module(id, deps, maker, root) {

        this.id = id;
        this.deps = deps; //必须是数组
        this.maker = maker;
        this.root = root || $;
        // _modulesMap[id] = 1;//定义之前
        // this.queue = new Queue();
        if(checkDeps(id)) {

            this.namespace();

        } else {

            this.init();
        }
    }
    Module.parentModule = {};
    Module.prototype.init = function() {
        _waitModule[this.id] = this;
        var self = this;
        $.use(this.deps, function() {
            self.namespace();
        })
    }
    Module.prototype.destroy = function() {
        for(var a in this) {
            if(this.hasOwnProperty(a)) {
                delete this[a];
            }
        }
    }
    Module.prototype.namespace = function() {
        if(!this.id) {
            return;
        }
        // _modulesMap[this.id] = 2;//定义等待中，可能因为依赖关系没有加载而处于等待中
        if(!checkDeps(this.id)) {

            return;
        }

        var names = this.id.split('/'),
            root = this.root;

        var name;
        while(name = names.shift()) {
            if(names.length) {
                // console.log(root);            
                root = (root[name] = root[name] || {});
            } else {
                if($.isUndefined(root[name])) {

                    try {
                        var f = $.isFunction(this.maker) && this.maker(this.root);
                        if(f) {

                            f['@GOD'] = 'THEO'; //加个尾巴~
                            root[name] = f;
                            _modulesMap[this.id] = 3;

                        }
                    } catch(e) {
                        // Module._definedModulesMap[this.id] = 2;//模块定义可能出错了
                        throw new Error('Module.namespace error:id=>' + this.id + ',info=>' + e.message);
                    }
                }
            }
        }
        var parent = Module.parentModule[this.id];
        if(parent && _waitModule[parent]) {
            _waitModule[parent].namespace();
        }
        var q = Queue.useCallback[this.id];
        if(q) {
            q.fire();
        }

        delete _waitModule[this.id];
        this.destroy();
    }

    var regProtocol = /^(\w+)(\d)?:.*/,
        //协议
        regISJS = /\.js$/i,
        //是否为js
        regISCSS = /\.css$/i,
        //是否为css
        regRelative = /\.\.\//g,
        //相对路径处理
        regEXT = /\.(\w+)$/; //后缀2~4
    /**
     * 获取真实url
     * 来自massframework
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */

    function getPath(url, root) {
        var ret;

        root = root || config.path;
        root = root.substr(0, root.lastIndexOf('/'));
        id = url;//模块id

        if(regAlias.test(url) && alias[url]){
            ret = alias[url];

        }else if(regProtocol.test(url)) { //如果用户路径包含协议
            ret = url;
        } else {
            var tmp = url.charAt(0),
                _2 = url.slice(0, 2);

            if(tmp !== '.' && tmp !== '/') { //相对于根路径
                ret = root + '/' + url;
            } else if(_2 === './') { //相对于兄弟路径
                id = url.substr(2);
                ret = root + '/' + id;
            } else if(_2 === '..') { //相对于父路径
                // var arr = root.replace(/\/$/, '').split('/');
                var arr = root.split('/');
                regRelative.lastIndex = 0;
                tmp = url.replace(regRelative, function() {
                    arr.pop();
                    return '';
                });
                id = tmp;
                ret = arr.join('/') + '/' + tmp;
            }
        }

        var ext = 'js'; //默认是js文件
        tmp = ret.replace(/[?#].*/, '');
        if(regEXT.test(tmp)) {
            ext = RegExp.$1;
        }
        if(ext !== 'css' && tmp === ret && !regISJS.test(ret)) { //如果没有后缀名会补上.js
            ret += '.js';
        }
        return [ret, ext, id];
    }

    /**
     * 一个简单队列
     * @param {[type]} id [description]
     */

    function Queue(id) {
        this.id = id;
        this.taskList = [];
    }
    Queue.useCallback = {}; //放置use使用的callback
    /**
     * 从后部推入
     * @param  {Function} fn    [description]
     * @param  {[type]}   args  [description]
     * @param  {[type]}   scope [description]
     * @return {[type]}         [description]
     */
    Queue.prototype.push = function(fn, args, scope) {
        return this._add(fn, args, scope, 'push');
    }
    Queue.prototype.unshift = function(fn, args, scope) {
        return this._add(fn, args, scope, 'unshift');
    }
    Queue.prototype._add = function(fn, args, scope, type) {
        if(!type) {
            return this;
        }
        args = _arrSlice.call(arguments, 0, -1);
        if(args.length === 0) {
            return this;
        }

        this.taskList[type](args);
        return this;
    }
    /**
     * 从后部弹出
     * @return {[type]} [description]
     */
    Queue.prototype.fire = function() {
        if(this._canIDo()) {
            var fn = this.taskList.pop();

            var args = $.isArray(fn[1]) ? fn[1] : [],
                scope = fn[2] || null;
            fn = fn[0];

            // argsFromCall = $.isArray(argsFromCall)?argsFromCall:[argsFromCall];
            // args = args.concat(argsFromCall);
            $.isFunction(fn) && fn.apply(scope, args);
            this.destroy();
        }
        return this;
    }
    Queue.prototype.destroy = function() {


        this.taskList.length = 0;
        delete this.taskList;
        delete Queue.useCallback[this.id]; //记得用完要销毁罪证哦~
        delete this.id;
        // delete Queue.modules[this.moduleName];
    }
    Queue.prototype._canIDo = function() {
        return this.taskList.length !== 0;
    }



    /**
     * 加载js
     * @param  {[type]}   url      [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   fail     [description]
     * @param  {[type]}   charset  [description]
     * @return {[type]}            [description]
     */

    function loadJS(url, callback, fail, charset) {
        var node = DOC.createElement('script');
        var args = _arrSlice.call(arguments, 0);
        if($.isString(fail) && args.length === 3) {
            //如果fail为字符串，认为是charset
            charset = fail;
        } else if(args.length === 4 && $.isString(charset)) {

        } else {
            charset = config.charset;
        }
        $.isFunction(callback) && jsCallback(node, callback, fail);

        node.charset = charset;
        node.async = true;
        node.src = url;
        HEAD.insertBefore(node, BASEELEMENT);
        return $;
    }

    //jscallback检测
    var regJSLOAD = /loaded|complete|undefined/;

    function jsCallback(node, callback, fail) {

        if($.isFunction(fail)) {
            node.onerror = jsGetCallback(node, fail);
            node.onload = node.onreadystatechange = jsGetCallback(node, callback);
        } else {
            node.onload = node.onerror = node.onreadystatechange = jsGetCallback(node, callback);
        }

    }
    //js可以检测error，所以加上了这个函数

    function jsGetCallback(node, cb) {
        return function(e) {
            e = e || global.event;
            
            if(e.type === 'load' || regJSLOAD.test(node.readyState)) {
                
                //确保执行一次+内存回收
                node.onload = node.onerror = node.onreadystatechange = null

                if(node.parentNode && !config.debug) {
                    HEAD.removeChild(node)
                }
            
                node = undefined

                cb()
            }
        }

    }
    /**
     * 加载css文件
     * @param  {[type]}   url      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */

    function loadCSS(url, callback, fail) {
        var node = DOC.createElement('link');
        node.rel = 'stylesheet';
        node.type = "text/css";

        cssCallback(node, callback, fail);

        node.href = url;
        HEAD.insertBefore(node, BASEELEMENT);
        return $;
    }
    ///===============>css load检测来自seajs
    // `onload` event is supported in WebKit since 535.23
    // Ref:
    //  - https://bugs.webkit.org/show_activity.cgi?id=38995
    var isOldWebKit = Number(UA.replace(/.*AppleWebKit\/(\d+)\..*/, '$1')) < 536;

    // `onload/onerror` event is supported since Firefox 9.0
    // Ref:
    //  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
    //  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
    var isOldFirefox = UA.indexOf('Firefox') > 0 && !('onload' in DOC.createElement('link'));
    var cssCallback = (isOldWebKit || isOldFirefox) ?
    function(node, callback, fail) {
        $.isFunction(callback) && 
        setTimeout(function() {
            poll(node, callback)
        }, 1) // Begin after node insertion
    } : function(node, callback, fail) {
        $.isFunction(callback) && (node.onload = function() {
            node.onload = node.onerror = null
            node = undefined
            callback()
        });
        $.isFunction(fail) && (node.onerror = function(){
            node.onload = node.onerror = null
            node = undefined
            fail()
        });
    }

    function poll(node, callback) {
        var isLoaded

        // for WebKit < 536
        if(isOldWebKit) {
            if(node.sheet) {
                isLoaded = true
            }
        }
        // for Firefox < 9.0
        else if(node.sheet) {
            try {
                if(node.sheet.cssRules) {
                    isLoaded = true
                }
            } catch(ex) {
                // The value of `ex.name` is changed from
                // 'NS_ERROR_DOM_SECURITY_ERR' to 'SecurityError' since Firefox 13.0
                // But Firefox is less than 9.0 in here, So it is ok to just rely on
                // 'NS_ERROR_DOM_SECURITY_ERR'
                if(ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
                    isLoaded = true
                }
            }
        }

        setTimeout(function() {
            if(isLoaded) {
                // Place callback in here due to giving time for style rendering.
                callback()
            } else {
                poll(node, callback)
            }
        }, 1)
    }

    /**
     * 获取类型
     * @param  {[type]} obj 要判断的对象
     * @return {String}     返回类型
     */

    function isType(obj, type) {
        return _cleanObj.toString.call(obj).slice(8, -1) === type;
    }

    /**
     * 糅杂
     * @param {Object} target 原有的默认
     * @param {Object} source 第三方来源
     */

    function mix(target, source) {
        var args = _arrSlice.call(arguments),
            i = 1,
            key, self = arguments.callee,
            //如果最后参数是布尔，判定是否覆写同名属性
            ride = $.isBoolean(args[args.length - 1]) ? args.pop() : true;
        if(args.length === 1) {
            target = !this.window ? this : _cleanObj;
            i = 0;
        }

        while((source = args[i++])) {
            //source = [{a:1},{b:3}];
            if($.isArray(source)) {
                for(var n = 0, len = source.length; n < len; n++) {
                    self(target, source[n], ride);
                }

                continue;
            }
            //杂糅只允许对象
            for(key in source) {
                if(ride || !(key in target)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }
}(window, document));