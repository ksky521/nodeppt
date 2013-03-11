var io = require('socket.io').listen(3000);
var ctrlSocket,userSocket,ctrlType = 'bind';
var ctrlDeviceNum = 0;
//控制端
ctrlSocket = io.of('/pptcontrol')
.on('connection', function(socket) {
	ctrlDeviceNum++;
	userSocket.emit('system', {
		msg: '已经有管理员用户连接上了，小心被控制'
	});
	
	ctrlSocket.emit('system', {
        msg: '控制端登录成功'
    });
	
	//控制端监听
	socket.on('order', function(data) {
		userSocket.emit('server order', data);
	});
	socket.on('handle by server', function(json) {
		userSocket.emit('server handle', json);
	});
	socket.on('server bind update',function(json){
		ctrlType = json.state;
		userSocket.emit('server control message',json);
	});
	
	
	socket.on('disconnect', function() {
		ctrlDeviceNum--;
        userSocket.emit('system', {
            msg: '管理员离开，失去通信',
			dowhat:'free'
        });
    });
});
//用户端，即被控制端
userSocket = io.of('/pptuser')
.on('connection', function(socket) {
	ctrlSocket.emit('system', {
		msg: '已经有用户连接上了'
	});
	ctrlDeviceNum>0 && userSocket.emit('server control message',{state:ctrlType});
	
	//pc端监听
	socket.on('update', function(data) {
		ctrlSocket.emit('server update', data);
	});
	socket.on('handle by client', function(json) {
		ctrlSocket.emit('client handle', json);
	});
	
	socket.on('disconnect', function() {
		ctrlSocket.emit('system', {
			msg: '一个用户悄悄离开，失去通信'
		});
	});
});
