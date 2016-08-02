var socketIOURL = '//' + location.host + '/socket.io/socket.io.js';

Slide.Control.add('socket', function (S, broadcast) {
    S.clientUID = 0;

    function time2str(time) {
        time = '00' + time;
        return time.substr(-2);
    }
    var showQrcode;
    var qrcodeLink = function () {
        //按 q显示控制区域二维码
        document.addEventListener('keydown', function (e) {
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

        showQrcode = function (e) {
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
        send_default: function (evtName, data) {
            webSocket.emit('transfer.data', {
                action: 'controlEvent:' + evtName,
                data: data
            });
        },
        send_keyEvent: function (keyCode) {
            Socket.send_default('keyEvent', {
                keyCode: keyCode
            })
        },
        clientConnect: function () {
        },
        evtHandler: function () {
            //角色是client，即被控制端，则连控制端服务器
            webSocket.on('transfer.data', function (data) {
                broadcast.fire(data.action, data.data);
            });
        },
        controlConnect: function () {
            webSocket.emit('control.addClient', {
                targetUid: this.clientUID
            });

            //控制端不在直接运行函数，而是变成发送socket给client
            //注意参数，进行了json处理哦~
            Slide.proxyFn = function (fnName, args) {
                args = JSON.stringify(args);
                Socket.send_default('proxyFn', {
                    fnName: fnName,
                    args: args
                });
            };
        },
        connect: function () {
            webSocket = io.connect(location.host + '/ppt');
            // console.log(io);
            webSocket.on('UUID', function (uid) {
                webSocket.uid = uid;
                if (Socket.role === 'client') {
                    MixJS.loadJS('/js/qrcode.js', function () {
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
            webSocket.on('system', function (data) {
                switch (data.action) {
                    case 'join':
                        if (showQrcode && showQrcode.isShow) {
                            showQrcode();
                        }
                        Socket.send_default('syncStatus', {
                            id: S.current,
                            item: S.curItem
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
        init: function (args) {
            this.host = args.host || location.href;
            this.clientUID = args.clientId;
            // console.log(this.clientUID);
            //角色，是否为控制端
            if (args.isControl) {
                this.role = 'control';
                Slide.timerCtrl();
            } else {
                this.role = 'client';
            }
            if (args.shake) {
                //添加shake
                MixJS.loadJS(Slide.dir + 'shake.js', function () {
                    var lastTime = Date.now();
                    window.addEventListener('shake', function () {
                        var now = Date.now();
                        if (now - lastTime > 3000) {
                            lastTime = now;
                            Socket.send_keyEvent(39);
                        }
                    }, true);

                });
            }

            if (window.io && io.connect) {
                //已经存在
                Socket.connect();
            } else {
                MixJS.loadJS(socketIOURL, function () {
                    Socket.connect();
                });
            }

        }
    };
    return Socket;
});
