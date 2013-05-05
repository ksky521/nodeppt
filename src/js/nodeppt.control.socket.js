var socketIOURL = Slide.dir + 'socket.io.js';
MixJS.loadJS(socketIOURL)
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
			webSocket.on('from control key event', function(data) {
				broadcast.fire('from control key event', data.keyCode);
			})
			webSocket.on('from control order', function(data) {
				var fnName = data.fn;
				var args = data.args;
				try {
					args = JSON.parse(args);
				} catch (e) {}
				Slide.proxyFn(fnName, args);
			});
		},
		controlConnect: function() {
			//控制端不在直接运行函数，而是变成发送socket给client
			//注意参数，进行了json处理哦~
			Slide.proxyFn = function(fnName, args) {
				args = JSON.stringify(args);
				webSocket.emit('from control user order', {
					fn: fnName,
					args: args
				});
			}
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
			webSocket.emit('from ' + Socket.role + ' user update', {
				id: id
			});
		},
		updateItem: function(id, item) {
			webSocket.emit('from ' + Socket.role + ' user updateItem', {
				id: id,
				item: item
			});
		},
		keyEvent: function(keyCode) {
			webSocket.emit('from ' + Socket.role + ' user key event', {
				keyCode: keyCode
			});

		},

		init: function(args) {
			this.host = args.host || location.href;
			//角色，是否为控制端
			if (args.isControl) {
				this.role = 'control';
				document.body.classList.add('popup');
				document.body.classList.add('with-notes');

			} else {
				this.role = 'client';
			}
			if (args.shake) {
				//添加shake
				MixJS.loadJS(Slide.dir + 'shake.js', function() {
					var lastTime = +new Date;
					addShakeEvent(function() {
						var now = +new Date;
						if (now - lastTime > 1000) {
							lastTime = now;
							Slide.next();
						}
					});
				});
			}
			check();
		}
	};
	return Socket;
});