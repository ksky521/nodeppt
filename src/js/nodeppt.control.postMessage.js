/**
 * postMessage 只能单方面控制
 *
 */
Slide.Control.add('postMessage', function(S, broadcast) {

	var postWin;
	var postMSG = {
		role: '', //角色
		update: function(id) {
			if (postWin) {
				window.opener.postMessage({
					action: 'update',
					id: id
				}, '*');
			}

		},
		updateItem: function(id, item) {
			if (postWin) {
				window.opener.postMessage({
					action: 'updateItem',
					id: id,
					item: item
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
		// 	console.log('client 发来贺电', arguments);
		// },
		evtClient: function(e) {
			var data = e.data;
			switch (data.action) {
				case 'update':
					broadcast.fire('from control update', data.id);
					break;
				case 'updateItem':
					broadcast.fire('from control updateItem', data.id, data.item);
					break;
				case 'keyEvent':
					broadcast.fire('from control key event', data.keyCode);
					break;
				case 'userOrder':
					var fnName = data.fn;
					var args = data.args;
					try {
						args = JSON.parse(args);
					} catch (e) {}
					Slide.proxyFn(fnName, args);
					break;
			}

		},
		init: function(args) {
			var t = this;
			if (location.hash === '#client') {
				this.role = 'client';
				var url = location.href.split('#')[0] + '#control';
				var temp = 'height=300, width=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=no, status=yes';
				window.open(url, 'ppt', temp);
				window.addEventListener('message', this.evtClient, false);

			} else {
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
				document.body.classList.add('popup');
				document.body.classList.add('with-notes');
				postWin = window.opener;
			}
		}
	};
	return postMSG;
});