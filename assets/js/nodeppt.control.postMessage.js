/**
 * postMessage 只能单方面控制
 *
 */
Slide.Control.add('postMessage', function(S, broadcast) {
    function parseQuery(url) {
        var back = {};
        (url || location.search.substring(1)).split('&').forEach(function(v) {
            v = v.split('=');
            back[v[0].toLowerCase()] = v[1];
        });
        return back;
    }

    var postWin, popup, timer;
    var postMSG = {
        role: '', //角色
        broadcast: function(evtName, data) {
            if (postWin) {
                window.opener.postMessage({
                    action: evtName,
                    data: data
                }, '*');
            }
        },
        update: function(id, direction) {
            if (postWin) {
                window.opener.postMessage({
                    action: 'update',
                    id: id,
                    direction: direction
                }, '*');
            }

        },
        updateItem: function(id, item, direction) {
            if (postWin) {
                window.opener.postMessage({
                    action: 'updateItem',
                    id: id,
                    item: item,
                    direction: direction
                }, '*');
            }

        },
        keyEvent: function(keyCode) {
            if (postWin) {
                window.opener.postMessage({
                    action: 'keyEvent',
                    keyCode: keyCode
                }, '*');
            }
        },
        // evtControl: function(e) {
        //     console.log('client 发来贺电', arguments);
        // },
        evtClient: function(e) {
            var data = e.data;
            switch (data.action) {
                case 'update':
                    broadcast.fire('from control update', data);
                    break;
                case 'updateItem':
                    broadcast.fire('from control updateItem', data);
                    break;
                case 'keyEvent':
                    broadcast.fire('from control key event', data);
                    break;
                case 'userOrder':
                    var fnName = data.fn;
                    var args = data.args;
                    try {
                        args = JSON.parse(args);
                    } catch (e) {}
                    Slide.proxyFn(fnName, args);
                    break;
                default:
                    broadcast.fire('from control ' + data.action, data.data);
            }

        },
        closeClient: function() {
            if (popup) {
                popup.close();
            }
            timer && clearInterval(timer);
        },
        init: function(args) {
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
                window.addEventListener('message', this.evtClient, false);
                window.addEventListener('beforeunload', this.closeClient, false);
            } else if (params._multiscreen === 'control') {
                this.role = 'control';
                //如果是控制端，则重写proxyFn函数
                Slide.proxyFn = function(fnName, args) {
                    args = JSON.stringify(args);
                    window.opener.postMessage({
                        action: 'userOrder',
                        fn: fnName,
                        args: args
                    }, '*');
                }
                var $body = document.body;
                $body.classList.add('popup');
                $body.classList.add('with-notes');
                var $timer = document.createElement('time');
                $timer.id = '_timer_';
                $body.appendChild($timer);
                var hour = 0,
                    sec = 0,
                    min = 0;
                timer = setInterval(function() {
                    sec++;
                    if (sec === 60) {
                        sec = 0;
                        min++;
                    }
                    if (min === 60) {
                        hour++;
                    }
                    $timer.innerHTML = ['时间：' + time2str(hour), time2str(min), time2str(sec) + ' 幻灯片：' + Slide.current + '/' + Slide.count].join(':');
                }, 1000);
                postWin = window.opener;
            }
        }
    };

    function time2str(time) {
        time = '00' + time;
        return time.substr(-2);
    }
    return postMSG;
});
