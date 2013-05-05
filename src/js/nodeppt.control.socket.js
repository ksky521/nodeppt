var socketIOURL = '//' + location.host + '/socket.io/socket.io.js';
MixJS.loadJS(socketIOURL);

Slide.Control.add('socket', function(S, broadcast) {
	S.clientUID = 0;

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

			webSocket.on('data from another client', function(data) {
				var action = data.action;
				switch (action) {
					case 'from control update':
						broadcast.fire('from control update', data.id);
						break;
					case 'from control updateItem':
						broadcast.fire('from control updateItem', data.id, data.item);
						break;
					case 'from control key event':
						broadcast.fire('from control key event', data.keyCode);
						break;
					case 'from control order':
						var fnName = data.fn;
						var args = data.args;
						try {
							args = JSON.parse(args);
						} catch (e) {}
						Slide.proxyFn(fnName, args);
						break;
				}
			});

		},
		controlConnect: function() {
			webSocket.emit('add client', {
				targetUid: this.clientUID
			});

			//控制端不在直接运行函数，而是变成发送socket给client
			//注意参数，进行了json处理哦~
			Slide.proxyFn = function(fnName, args) {
				args = JSON.stringify(args);
				webSocket.emit('repost data', {
					action: 'from control order',
					fn: fnName,
					args: args
				})
			}
			//角色是控制端，则连被控制端（client）服务器

			webSocket.on('data from another client', function(data) {
				var action = data.action;
				switch (action) {
					case 'from client update':
						broadcast.fire('from control update', data.id);
						break;
					case 'from client updateItem':
						broadcast.fire('from control updateItem', data.id, data.item);
						break;

				}
			});

		},
		connect: function() {
			webSocket = io.connect(this.host);
			webSocket.on('UUID', function(uid) {
				webSocket.uid = uid;
			});
			webSocket.on('system', function(data) {
				console.log(data);
			});

			this[this.role + 'Connect']();
		},
		update: function(id) {
			webSocket.emit('repost data', {
				action: 'from ' + Socket.role + ' update',
				id: id
			});
		},
		updateItem: function(id, item) {
			webSocket.emit('repost data', {
				action: 'from ' + Socket.role + ' updateItem',
				id: id,
				item: item
			});
		},
		keyEvent: function(keyCode) {
			webSocket.emit('repost data', {
				action: 'from ' + Socket.role + ' key event',
				keyCode: keyCode
			});
		},

		init: function(args) {
			this.host = args.host || location.href;
			this.clientUID = location.hash.slice(8);
			console.log(this.clientUID);
			//角色，是否为控制端
			if (args.isControl) {
				console.log(this.clientUID);
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