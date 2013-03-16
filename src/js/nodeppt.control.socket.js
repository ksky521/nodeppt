var ctrlType = 'unbind';
	
	//重写代理函数，变为发送广播
	Slide.proxyFn = function(fnName, args){
		ctrlType !== 'unbind' && $B.fire('slide control order',{
			fnName:fnName,
			args:args
		})
	}
	//发送webSocket消息

	function sendWebSoketMessage(json) {
		if (doWebSocket && webSocket && ctrlType !== 'unbind') {

			webSocket.emit(defaultOptions.isControlDevice ? 'order' : 'update', json);
		}
	}
	//发送webSocket执行函数命令

	function sendWebSoketOrder(handleFnName, args) {
		//		console.log(handleFnName);
		if (doWebSocket && webSocket && ctrlType !== 'unbind') {
			//			console.log('send order');

			webSocket.emit(defaultOptions.isControlDevice ? 'handle by server' : 'handle by client', {
				handleFnName: handleFnName,
				args: args
			});
		}
	}
	//链接websoket

	function connWebSoket() {
		try {
			if (doWebSocket) {
				doWebSocket = false;
				webSocket = io.connect(webSocketHost);

				//系统消息
				webSocket.on('system', function(data) {
					doWebSocket = true;
					showTips(data.msg);
					if (data.dowhat === 'free') {
						ctrlType = 'bind';
					}
				});
				if (defaultOptions.isControlDevice) {
					//如果是控制端，则接收pc端更新消息:update
					webSocket.on('server update', function(data) {
						doWebsocketUpdate(data);
					});
					webSocket.on('client handle', function(data) {
						if (data.handleFnName && typeof window[data.handleFnName] === 'function') {
							window[data.handleFnName].call({}, data.args);
						}
					});


				} else {
					//如果是pc端，则接收控制消息:order
					webSocket.on('server order', function(data) {
						doWebsocketUpdate(data);
					});
					webSocket.on('server handle', function(data) {
						if (data.handleFnName && typeof window[data.handleFnName] === 'function') {
							window[data.handleFnName].apply({}, data.args);
						}
					});

					webSocket.on('server control message', function(data) {
						switch (data.state) {
							case 'bind':
								//完全同步
								ctrlType = data.state;
								showTips('状态转化：目前是完全同步状态');
								break;
							case 'unbind':
								//释放状态
								ctrlType = data.state;
								showTips('状态转化：目前是释放控制状态');
								break;
							case 'bindAll':
								//完全绑定
								ctrlType = data.state;
								showTips('状态转化：目前是完全控制状态');
								break;
						}
					});
				}
			}
		} catch (e) {
			throw new Error('websocket connect error!');
		}
	}
	//控制状态

	function sendControlState(state) {
		//bind
		//bindAll
		//unbind
		if (defaultOptions.isControlDevice && defaultOptions.doWebSocket && webSocket) {
			ctrlType = state;
			webSocket.emit('server bind update', {
				state: state
			});
			'bind bindAll unbind'.replace(/\S+/g, function(a) {
				$$(a).classList.remove('orange');
				if (state === a) {
					$$(state).classList.add('orange');
				}
			});
		}
	}

	//控制端代码=========================>

	function doWebsocketUpdate(data) {
		//控制端
		doWebSocket = 0;
		if (data.donext && curIndex === data.donext) {
			nextSlide();
			doWebSocket = 1;
			return;
		}
		curIndex = data.slideID;

		doSlide();
		preload($slides[curIndex])($slides[curIndex + 1]);
		doWebSocket = 1;


		if (defaultOptions.doWebSocket && defaultOptions.webSocketHost !== '') {
			doWebSocket = 1;
			webSocketHost = defaultOptions.webSocketHost + (defaultOptions.isControlDevice ? 'pptcontrol' : 'pptuser'); //'http://192.168.2.4:3000'
			loadJS('js/socket.io.js', connWebSoket);
		} else {
			doWebSocket = 0;
		}
	}