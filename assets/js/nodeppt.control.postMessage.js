/**
 * postMessage 只能单方面控制
 *
 */
Slide.Control.add('postMessage', function (S, broadcast) {
    function parseQuery(url) {
        var back = {};
        (url || location.search.substring(1)).split('&').forEach(function (v) {
            v = v.split('=');
            back[v[0].toLowerCase()] = v[1];
        });
        return back;
    }
    broadcast.on('controlEvent:joinClient', function () {
        postMSG.send_default('syncStatus', {
            id: S.current,
            item: S.curItem
        });
    });

    var postWin, popup, timer;
    var postMSG = {
        role: '', //角色
        send_default: function (evtName, data) {
            var win = (postWin ? postWin : popup);
            win && win.postMessage({
                action: 'controlEvent:' + evtName,
                data: data
            }, '*');
        },
        send_keyEvent: function (keyCode) {
            postMSG.send_default('keyEvent', {
                keyCode: keyCode
            })
        },
        // evtControl: function (e) {
        //     console.log('client 发来贺电', arguments);
        // },
        evtHandler: function (e) {
            var data = e.data;
            broadcast.fire(data.action, data.data);
        },
        closeClient: function () {
            if (popup) {
                popup.close();
            }
            timer && clearInterval(timer);
        },
        init: function (args) {
            var t = this;
            var params = parseQuery();

            if (params._multiscreen === '1') {
                this.role = 'client';
                var url = location.href.replace('_multiscreen=1', '_multiscreen=control');

                var sWidth = screen.width,
                    sHeight = screen.height,
                    tWidth = sWidth * 0.8,
                    tHeight = sHeight * 0.8;

                var temp = 'height=' + tHeight + ',width=' + tWidth + ',top=' + 10 + ',left=' + (sWidth - tWidth) / 2 + ',toolbar=no,menubar=no,location=yes,resizable=yes,scrollbars=no,status=no';
                popup = window.open(url, 'ppt', temp);
                window.addEventListener('message', this.evtHandler, false);
                window.addEventListener('beforeunload', this.closeClient, false);
            } else if (params._multiscreen === 'control') {
                this.role = 'control';
                //如果是控制端，则重写proxyFn函数
                Slide.proxyFn = function (fnName, args) {
                    args = JSON.stringify(args);
                    postMSG.send_default('proxyFn', {
                        fnName: fnName,
                        args: args
                    });
                };
                Slide.timerCtrl();
                postWin = window.opener;
                postMSG.send_default('joinClient');
                window.addEventListener('message', this.evtHandler, true);
            }
        }
    };


    return postMSG;
});
