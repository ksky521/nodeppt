var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket){
	socket.broadcast.emit('system', {
		msg: '已经有用户链接上了，小心被控制'
	});
	//pc端监听
	socket.on('update', function(data){
		socket.broadcast.emit('server update',data);
	});
	socket.on('handle by client',function(json){
        socket.broadcast.emit('client handle',json);
    });
	
	//控制端监听
	socket.on('order', function(data){
        socket.broadcast.emit('server order',data);
    });
	socket.on('handle by server',function(json){
		socket.broadcast.emit('server handle',json);
	});
	
	
	socket.on('disconnect', function(){
		io.sockets.emit('system', {
			msg: '用户悄悄离开，失去通信'
		});
	});
});