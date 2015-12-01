/**
 * 控制端函数
 */
(function($win, $doc, $B, Slide, loadJS, undefined) {
    var $slides = Slide.$slides;

    // function doItem(direction) {
    //     return Slide[direction === 'prev' ? 'buildPrevItem' : 'buildNextItem'](true);
    // }

    function getType(obj) {
        return ({}).toString.call(obj).slice(8, -1)
    }

    var Control = {
        state: 'unbind',
        methods: {},
        init: function() {
            this.bindListener();
        },
        bindListener: function() {
            var t = this;
            //监听用户端发出的广播
            $B.on('nodepptEvent:eventKeyup', function(e) {
                    t.sendKeyEvent(e.keyCode);
                }).on('nodepptEvent:show paint', function(e) {
                    t.sendKeyEvent(80);
                }).on('nodepptEvent:remove paint', function() {
                    t.sendKeyEvent(67);
                }).on('nodepptEvent:paint points', function(points) {
                    var data = {
                        points: points,
                        screen: {
                            width: $doc.body.offsetWidth,
                            height: $doc.body.offsetHeight
                        }
                    };
                    t.send_('default', ['paint points', data]);
                })
                //监听控制来的广播
                .on('controlEvent:proxyFn', function(json) {
                    var fnName = json.fnName;
                    var args = json.args;
                    try{
                        args = JSON.parser(args);
                    }catch(e){
                        args = '';
                    }
                    Slide.proxyFn(fnName, args);
                }).on('controlEvent:keyEvent', function(json) {
                    t.createKeyEvent_(json.keyCode);
                });
        },
        createKeyEvent_: function(keyCode) {
            var evt = document.createEvent('Event');
            evt.initEvent('keyup', true, true);
            evt.keyCode = keyCode;
            evt.isFromControl = true;

            document.dispatchEvent(evt);
        },
        send_: function(fnName, args) {
            var methods = this.methods;
            var method;
            args = getType(args) === 'Array' ? args : [args];
            for (var i in methods) {
                method = methods[i];
                method = method['send_' + fnName];
                typeof method === 'function' && method.apply(Slide, args);
            }
        },
        sendKeyEvent: function(keycode) {
            this.send_('keyEvent', [keycode]);
        },

        //添加一个新的监控
        add: function(name, factory, override) {
            var methods = this.methods;

            if (override || !methods[name]) {
                methods[name] = factory(Slide, $B);
                //必须包括4个函数一个是监控翻页的update
                //另外一个是updateItem
                //一个是init
                //keyEvent;
            }
        },
        load: function(type, args) {
            var url = Slide.dir + 'nodeppt.control.' + type + '.js';
            loadJS(url, function() {
                Slide.Control.methods[type].init(args);
            });
        }
    };
    Control.init();
    Slide.Control = Control;
}(window, document, MixJS.event.broadcast, Slide, MixJS.loadJS));
