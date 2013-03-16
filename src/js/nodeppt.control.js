/**
 * 控制端函数
 */
(function($win, $doc, $B,Slide, undefined) {
	var Control = {
		state:'unbind',
		methods:{},
		init:function(){
			bindListener();
		},
		bindListener() {
			var t = this;
			$B.on('slide change ID', function(json) {
				var slideID = json.slideID;
				//发送请求
				t.sendUpdate(slideID);
				console.log('发送翻页请求完毕');
			}).on('slide do build', function(json) {
				var slideID = json.slideID;
				var buildItem = json.build;
				//发送请求
				t.sendUpdateItem(slideID,buildItem);
				console.log('发送item请求完毕');
			})
		},
		sendUpdate:function(slideID){
			var methods = this.methods;
			var method;
			for(var i in methods){
				method = methods[i];
				typeof method.update==='function' && method.update(slideID);
			}
		},
		sendUpdateItem:function(id,buildItem){
			var methods = this.methods;
			var method;
			for(var i in methods){
				method = methods[i];
				typeof method.updateItem==='function' && method.updateItem(id,buildItem);
			}
		},
		//添加一个新的监控
		add:function(name,factory,override){
			var methods = this.methods;

			if(override || !methods[name]){

				methods[name] = factory();
				//必须包括两个函数一个是监控翻页的update
				//另外一个是updateItem
			}
		}
	}
	
}(window, document, MixJS.event.broadcast,Slide));