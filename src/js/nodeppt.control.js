/**
 * 控制端函数
 */
(function($win, $doc, $B, Slide, loadJS, undefined) {
	var $slides = Slide.$slides;
	var doSlide = Slide.doSlide;

	function doItem(id, itemID) {
		itemID = itemID | 0;
		var $curSlide = $slides[id];
		var toBuild = $curSlide.querySelectorAll('.build > *');
		var list;
		var index = itemID;

		while (itemID>=0) {
			list = toBuild.item(itemID).classList;
			list.remove('to-build');
			list.add(itemID === index ? 'building' : 'build-fade');
			itemID--;
		}
	}


	var Control = {
		state: 'unbind',
		methods: {},
		init: function() {
			this.bindListener();
		},
		bindListener: function() {
			var t = this;
			//监听用户端发出的广播
			$B.on('slide change ID', function(json) {
				var slideID = json.slideID;
				//发送请求
				t.sendUpdate(slideID);

			}).on('slide do build', function(json) {
				var slideID = json.slideID;
				var buildItem = json.build;
				//发送请求
				t.sendUpdateItem(slideID, buildItem);
			});
			//监听控制来的广播
			$B.on('from control order', function(json) {
				var fnName = json.fnName;
				var args = json.args;
				Slide.proxyFn(fnName, args);
			});
			$B.on('from control update', function(id) {
				doSlide(id,false);
			});
			$B.on('from control updateItem', function(id, item) {
				doSlide(id,false);
				doItem(id, item);
			});
		},
		sendUpdate: function(slideID) {
			var methods = this.methods;
			var method;
			for (var i in methods) {
				method = methods[i];
				typeof method.update === 'function' && method.update(slideID);
			}
		},
		sendUpdateItem: function(id, buildItem) {
			var methods = this.methods;
			var method;
			for (var i in methods) {
				method = methods[i];
				typeof method.updateItem === 'function' && method.updateItem(id, buildItem);
			}
		},
		//添加一个新的监控
		add: function(name, factory, override) {
			var methods = this.methods;

			if (override || !methods[name]) {
				methods[name] = factory(Slide, $B);
				//必须包括三个函数一个是监控翻页的update
				//另外一个是updateItem
				//一个是init
			}
		},
		load: function(type, args) {
			var url = Slide.dir + 'nodeppt.control.' + type + '.js';
			loadJS(url, function() {
				Slide.Control.methods[type].init(args);
			});
		}
	}
	Control.init();
	Slide.Control = Control;
}(window, document, MixJS.event.broadcast, Slide, MixJS.loadJS));