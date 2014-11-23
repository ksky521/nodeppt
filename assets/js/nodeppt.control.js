/**
 * 控制端函数
 */
(function($win, $doc, $B, Slide, loadJS, undefined) {
    var $slides = Slide.$slides;
    var doSlide = Slide.doSlide;

    function doItem(id, itemID) {
        itemID = itemID | 0;
        var $curSlide = $slides[id];
        var buildClass = '.build > *,.fadeIn > *,.moveIn > *,.bounceIn > *,.zoomIn > *,.fade > *';
        var toBuild = $curSlide.querySelectorAll(buildClass);
        var list;
        var index = itemID;

        while (itemID >= 0) {
            list = toBuild.item(itemID).classList;
            list.remove('to-build');
            list.add(itemID === index ? 'building' : 'build-fade');
            itemID--;
        }
    }

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
            $B.on('slide change ID', function(json) {
                var slideID = json.slideID;
                //发送请求
                t.sendUpdate(slideID);

            }).on('slide do build', function(json) {
                var slideID = json.slideID;
                var buildItem = json.build;
                //发送请求
                t.sendUpdateItem(slideID, buildItem);
            }).on('slide event keyup', function(e) {
                t.sendKeyEvent(e.keyCode);
            }).on('overview', function(e) {
                t.sendKeyEvent(79);
            }).on('show paint', function(e){
                t.sendKeyEvent(80);
            }).on('remove paint', function(){
                t.sendKeyEvent(67);
            }).on('paint points', function(points) {
                var data = {
                    points: points,
                    screen: {
                        width: $doc.body.offsetWidth,
                        height: $doc.body.offsetHeight
                    }
                };
                t.send_('broadcast', ['paint points', data]);
            })
            //监听控制来的广播
            .on('from control order', function(json) {
                var fnName = json.fnName;
                var args = json.args;
                Slide.proxyFn(fnName, args);
            }).on('from control update', function(json) {
                doSlide(json.id, false);
            }).on('from control updateItem', function(json) {
                doSlide(json.id, false);
                doItem(json.id, json.item);
            }).on('from control key event', function(json) {
                t.createKeyEvent_(json.keyCode);
            })
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
                method = method[fnName];
                typeof method === 'function' && method.apply(Slide, args);
            }
        },
        sendUpdate: function(slideID) {
            this.send_('update', [slideID]);
        },
        sendUpdateItem: function(id, buildItem) {
            this.send_('updateItem', [id, buildItem]);
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
