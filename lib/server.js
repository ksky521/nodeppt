module.exports.start = function(port) {
    port = parseInt(port, 10) || 8080;
    var io = require('socket.io').listen(port, {
        // log: false,
        origins: '*:*' //解决同源策略
    }, function() {
        console.log('start server @ localhost:' + port);
    });

    //控制端
    ctrlSocket = io.of('/control')
        .on('connection', function(socket) {
        userSocket.emit('system', {
            msg: '已经有管理员用户连接上了，小心被控制'
        });
        console.log('控制端登录成功');
        userSocket.emit('system', {
            msg: '控制端登录成功'
        });

        //控制端监听
        socket.on('from client user update', function(data) {
            userSocket.emit('from client update', data);
        });
        socket.on('from client user updateItem', function(json) {
            userSocket.emit('from client updateItem', json);
        });


        socket.on('disconnect', function() {
            userSocket.emit('system', {
                msg: '管理员离开，失去通信',
                dowhat: 'free'
            });
        });
    });
    //用户端，即被控制端
    userSocket = io.of('/client')
        .on('connection', function(socket) {
        ctrlSocket.emit('system', {
            msg: '已经有用户连接上了'
        });
        console.log('客户端连上');
        //pc端监听
        socket.on('from control user update', function(data) {
            ctrlSocket.emit('from control update', data);
        });
        //用户按键检测事件
        socket.on('from control user key event', function(data) {
            console.log('control user key event', data);
            ctrlSocket.emit('from control key event', data);
        });

        socket.on('from control user updateItem', function(json) {
            ctrlSocket.emit('from control updateItem', json);
        });
        socket.on('from control user order', function(json) {
            ctrlSocket.emit('from control order', json);
        });


        socket.on('disconnect', function() {
            ctrlSocket.emit('system', {
                msg: '一个用户悄悄离开，失去通信'
            });
        });
    });
}