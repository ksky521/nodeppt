var socketIOURL = 'js/socket.io.js';
MixJS.loadJS(socketIOURL);
Slide.Control.add('socket', function(S, broadcast) {

	var timer;
	//检查是否加载完成socket.io.js
	var check = function() {
		timer && clearTimeout(timer);

		timer = setTimeout(function() {
			if (io && io.connect) {
				Socket.connect();
			} else {
				check();
			}
		}, 100);
	}
	var webSocket;
	var Socket = {
		host: '',
		role: '', //角色
		clientConnect: function() {
			//角色是client，即被控制端，则连控制端服务器
			webSocket = io.connect(this.host + '/control');
			webSocket.on('system', function(data) {
				console.log(data);
			});
			webSocket.on('from control update', function(data) {

				broadcast.fire('from control update', data.id);
			});
			webSocket.on('from control updateItem', function(data) {
				broadcast.fire('from control updateItem', data.id, data.item);
			});
			webSocket.on('from control proxyFn', function(data) {
				var fnName = data.fnName;
				var args = data.args;
			});
		},
		controlConnect: function() {
			//角色是控制端，则连被控制端（client）服务器
			webSocket = io.connect(this.host + '/client');
			webSocket.on('system', function(data) {
				console.log(data);
			});
			webSocket.on('from client update', function(data) {
				broadcast.fire('from control update', data.id);
			});
			webSocket.on('from client updateItem', function(data) {
				broadcast.fire('from control updateItem', data.id, data.item);
			});
			// webSocket.on('from client proxyFn', function(data) {
			// 	var fnName = data.fnName;
			// 	var args = data.args;
			// });
		},
		connect: function() {
			this[this.role + 'Connect']();
		},
		update: function(id) {
			webSocket.emit(this.role === 'control' ? 'from control user update' : 'from client user update', {
				id: id
			});
		},
		updateItem: function(id, item) {
			webSocket.emit(this.role === 'control' ? 'from control user updateItem' : 'from client user updateItem', {
				id: id,
				item: item
			});
		},
		init: function(args) {
			this.host = args.host || location.href;
			//角色，是否为控制端
			this.role = args.isControl ? 'control' : 'client';
			check();
		}
	};
	return Socket;
});