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
					action:'update',
					id: id
				}, '*');
			} 

		},
		updateItem: function(id, item) {
			if (postWin) {
				window.opener.postMessage({
					action:'updateItem',
					id: id,
					item: item
				},'*');
			}

		},
		// evtControl: function(e) {
		// 	console.log('client 发来贺电', arguments);
		// },
		evtClient: function(e) {
			var data = e.data;
			if(data.action==='update'){
				broadcast.fire('from control update', data.id);
			}else{
				broadcast.fire('from control updateItem', data.id, data.item);
			}
		},
		init: function(args) {
			var t = this;
			if (location.hash === '#client') {
				this.role = 'client';
				var url = location.href.split('#')[0] + '#control';
				var temp = 'height=300, width=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=no, status=yes';
				postWin = window.open(url, 'ppt', temp);
				window.addEventListener('message', this.evtClient, false);
				
			} else {
				this.role = 'control';
				document.body.classList.add('popup');
				document.body.classList.add('with-notes');
				postWin = window.opener;
			}
		}
	};
	return postMSG;
});