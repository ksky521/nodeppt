var socketIOURL = '//' + location.host + '/socket.io/socket.io.js';

Slide.Control.add('socket', function(S, broadcast) {
    S.clientUID = 0;

    function time2str(time) {
        time = '00' + time;
        return time.substr(-2);
    }
    var showQrcode;
    var qrcodeLink = function() {
        //按 q显示控制区域二维码
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 81) {
                showQrcode(e);
            }
        }, true);
        var $layer = document.createElement('div');
        $layer.className = 'qrcode';
        $layer.id = 'qrcodeBox';
        $layer.innerHTML = '<div id="qrcode"></div><p><a id="ctrlLink" href="#" target="_blank">打开控制端</a></p>';
        var $body = document.getElementsByTagName('body')[0];
        $body.appendChild($layer);
        var $container = document.getElementById('container');

        showQrcode = function(e) {
            if (showQrcode.isShow) {
                // $container.style.display = 'block';
                $layer.style.display = 'none';
                showQrcode.isShow = false;
            } else {
                // $container.style.display = 'none';
                $layer.style.display = 'block';
                showQrcode.isShow = true;
            }
        };
        showQrcode();
    };

    var webSocket;

    var Socket = {
        host: '',
        role: '', //角色
        clientConnect: function() {},
        evtHandler: function() {
            //角色是client，即被控制端，则连控制端服务器
            webSocket.on('transfer.data', function(data) {
                var action = data.action;
                switch (action) {
                    case 'controll.proxyFnOrder':
                        var fnName = data.fn;
                        var args = data.args;
                        try {
                            args = JSON.parse(args);
                        } catch (e) {}
                        Slide.proxyFn(fnName, args);
                        break;
                    case 'updateItem':
                    case 'update':
                    case 'keyEvent':
                        broadcast.fire(action, data);
                        break;
                    case 'syncStatus':
                        console.log('sync status', data);
                        break;
                    default:
                        broadcast.fire(action, data.data);
                }
            });
        },
        controlConnect: function() {
            webSocket.emit('control.addClient', {
                targetUid: this.clientUID
            });

            //控制端不在直接运行函数，而是变成发送socket给client
            //注意参数，进行了json处理哦~
            Slide.proxyFn = function(fnName, args) {
                args = JSON.stringify(args);
                webSocket.emit('transfer.data', {
                    action: 'controll.proxyFnOrder',
                    fn: fnName,
                    args: args
                });
            };
        },
        connect: function() {
            webSocket = io.connect(location.host + '/ppt');
            // console.log(io);
            webSocket.on('UUID', function(uid) {
                webSocket.uid = uid;
                if (Socket.role === 'client') {
                    MixJS.loadJS('/js/qrcode.js', function() {
                        qrcodeLink();
                        var url = location.href.split('#')[0];
                        url += (!~url.indexOf('?')) ? '?' : '&';
                        url += 'iscontroller=1&clientid=' + encodeURIComponent(uid);
                        var qrcode = new QRCode('qrcode', {
                            text: url,
                            width: 256,
                            height: 256
                        });
                        document.getElementById('ctrlLink').href = url;
                    });
                }
            });
            webSocket.on('system', function(data) {
                switch (data.action) {
                    case 'join':
                        if (showQrcode && showQrcode.isShow) {
                            showQrcode();
                        }
                        webSocket.emit('transfer.data', {
                            action: 'syncStatus',
                            id: S.current,
                            item: S.buildItem
                        });
                        break;
                    case 'leave':
                        //主动显示二维码，用于重新连接
                        if (showQrcode) {
                            showQrcode.isShow = false;
                            showQrcode();
                        }
                        break;
                }
            });

            this[this.role + 'Connect']();
            this.evtHandler();
        },
        broadcast: function(evtName, data) {
            webSocket.emit('transfer.data', {
                action: evtName,
                data: data
            });
        },
        update: function(id, direction) {
            webSocket.emit('transfer.data', {
                action: 'update',
                id: id,
                direction: direction
            });
        },
        updateItem: function(id, item, direction) {
            webSocket.emit('transfer.data', {
                action: 'updateItem',
                id: id,
                item: item,
                direction: direction
            });
        },
        keyEvent: function(keyCode) {
            webSocket.emit('transfer.data', {
                action: 'keyEvent',
                keyCode: keyCode
            });
        },

        init: function(args) {
            this.host = args.host || location.href;
            this.clientUID = args.clientId;
            // console.log(this.clientUID);
            //角色，是否为控制端
            if (args.isControl) {
                this.role = 'control';
                var $body = document.body;
                $body.classList.add('popup');
                $body.classList.add('with-notes');
                var $timer = document.createElement('time');
                $timer.id = '_timer_';
                $body.appendChild($timer);
                var hour = 0,
                    sec = 0,
                    min = 0;
                timer2 = setInterval(function() {
                    sec++;
                    if (sec === 60) {
                        sec = 0;
                        min++;
                    }
                    if (min === 60) {
                        min = 0;
                        hour++;
                    }
                    $timer.innerHTML = ['时间：' + time2str(hour), time2str(min), time2str(sec) + ' 幻灯片：' + Slide.current + '/' + Slide.count].join(':');
                }, 1000);
            } else {
                this.role = 'client';
            }
            if (args.shake) {
                //添加shake
                MixJS.loadJS(Slide.dir + 'shake.js', function() {
                    var lastTime = Date.now();
                    window.addEventListener('shake', function() {
                        var now = Date.now();
                        if (now - lastTime > 3000) {
                            lastTime = now;
                            Slide.next();
                        }
                    }, true);

                });
            }

            if (window.io && io.connect) {
                //已经存在
                Socket.connect();
            } else {
                MixJS.loadJS(socketIOURL, function() {
                    Socket.connect();
                });
            }

        }
    };
    return Socket;
});
