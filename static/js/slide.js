//slide
;!function(doc,win){
	/*************配置****************/
	var defaultSlide = {
		title: 'no tilte',
		id: '',
		border: true,
		animate: 'normal',
		remark: 'no remark',
		content: ''
	},
	args = {
        slideId: 'slide',
        canvasId: '',
        ctrlId: '',
        presentClass: 'present',
        pastClass: 'past',
        remoteControl: false,
        futureClass: 'future',
        showHelp: true
    };
	/*************变量声明区****************/
    var socket,
	    $slide,
        steps = [],//slide nodelist
        len = 0,//长度
        animates = [],//动画数组
        slideList = [],//socket发送大纲列表
        doHash = true,
        progress,
        curNode,
        prevNode,
        nextNode,
		lines = [],
        oldLines = lines,
        dobuild = false,
        curLine,
        prevLine,
        nextLine,
        canvas,
        presentClass = 'present',
        pastClass = 'past',
        futureClass = 'future';   
	
   /**************工具函数定义区************/
   var byId = function(id){
   	if (typeof id !== 'string' || id === '') {
   		return false;
   	}
   	return doc.getElementById(id);
   }, 
   $ = function(selector, context){
   	context = context || doc;
   	return context.querySelector(selector);
   }, 
   $$ = function(selector, context){
   	context = context || doc;
   	return toArray(context.querySelectorAll(selector));
   }, 
   toArray = function(nodelist){
   	return [].slice.call(nodelist);
   }, 
   getElementFromUrl = function(){
   	return byId(win.location.hash.replace(/^#\/?/, ""));
   }, 
   parseExt = function(str){
   	var hasAction;
   	str = str.replace(/<\!--pause-->/ig, function(sub, index){
   		var output = hasAction ? '</div>' : '';
   		hasAction = true;
   		output += '<div data-build>';
   		return output;
   	});
	
   	str = str.replace(/<a/ig, '<a target="_blank"');
   	if (hasAction) {
   		str += '</div>';
   	}
   	return str;
   }, 
   parseParam = function(oSource, oParams, isown){
   	var key, obj = {};
   	oParams = oParams || {};
   	for (key in oSource) {
   		obj[key] = oSource[key];
   		if (oParams[key] != null) {
   			if (isown) {// 仅复制自己
					if (oSource.hasOwnProperty[key]) {
						obj[key] = oParams[key];
					}
				}
				else {
					obj[key] = oParams[key];
				}
			}
		}
		return obj;
	};
  
  
	/***************更新slide主函数********************/
	function update(active, direction){
		if (dobuild) {
			return;
		}
		direction = direction || 'down';
		removePaint();//去掉画图
		var index = 0;
		
		if (!~ (index = steps.indexOf(active))) {
			index = 0;
			active = steps[0];
		}
		curNode = active;
		lines = toArray($$('[data-build]', active));
		
		if (lines.length > 0) {
			if (direction === 'down') {
				lines.forEach(function(el){
					el.classList.remove("visible");
				});
				oldLines = [];
			}
			else {
				oldLines = toArray($$('[data-build].visible', active));
				lines = [];
			}
		}
		else {
			lines = [];
			oldLines = [];
		}
		
		
		var prev = index - 1;
		prevNode = prev >= 0 ? steps[prev] : steps[len - 1];
		
		var next = index + 1;
		nextNode = next < len ? steps[next] : steps[0];
		
		//css3 动画切换
		clearClass();
		
		active.classList.add(presentClass);
		prevNode.classList.add(pastClass);
		nextNode.classList.add(futureClass);
		//更新进度条
		progress.style.width = ((index + 1) / len) * win.innerWidth + 'px';
		doHash = false;
		win.location.hash = "#" + active.id;
		
		return false;
	}
    /********清除class********/
	function clearClass(){
		var arr = [presentClass, pastClass, futureClass],
		  exp = new RegExp('(?:\s*' + arr.join('|') + '\s*)', 'g');
		  
		toArray($$('.' + arr.join(',.'), $slide)).forEach(function(el){
			el.className = el.className.replace(exp, '');
		});
	}

    /***********画图部分事件处理函数************/
	function canvasReady(){
		if (!canvas) {
			return;
		}
		canvas.width = win.innerWidth;
		canvas.height = win.innerHeight;
		canvas.context = canvas.getContext('2d');
		canvas.context.lineWidth = 5;
		canvas.context.lineCap = 'round';
		canvas.context.strokeStyle = "red";
		
	}
	function showPaint(){
		if (!canvas) {
			return;
		}
		canvasReady();
		canvas.style.display = '';
		canvas.style.cursor = 'crosshair';
		canvas.addEventListener('mousedown', pMouseDown, false);
		canvas.addEventListener('mouseup', pMouseUp, false);
		canvas.addEventListener('mousemove', pMouseMove, false);
	}
  
	function clearPaint(){
		if (!canvas) {
			return;
		}
		canvas.context && canvas.context.clearRect(0, 0, canvas.width, canvas.height);
		canvas.style.display = 'none';
	}
	var removePaint = function(){
		if (!canvas) {
			return;
		}
		clearPaint();
		canvas.removeEventListener('mousedown', pMouseDown);
		canvas.removeEventListener('mouseup', pMouseUp);
		canvas.removeEventListener('mousemove', pMouseMove);
	}, pMouseDown = function(e){
		canvas.isMouseDown = true;
		canvas.iLastX = e.clientX - canvas.offsetLeft + (win.pageXOffset || doc.body.scrollLeft || doc.documentElement.scrollLeft);
		canvas.iLastY = e.clientY - canvas.offsetTop + (win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop);
	}, pMouseUp = function(){
		canvas.isMouseDown = false;
		canvas.iLastX = -1;
		canvas.iLastY = -1;
	}, pMouseMove = function(e){
		if (canvas.isMouseDown) {
			var iX = e.clientX - canvas.offsetLeft + (win.pageXOffset || doc.body.scrollLeft || doc.documentElement.scrollLeft);
			var iY = e.clientY - canvas.offsetTop + (win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop);
			canvas.context.beginPath();
			canvas.context.moveTo(canvas.iLastX, canvas.iLastY);
			canvas.context.lineTo(iX, iY);
			canvas.context.stroke();
			canvas.iLastX = iX;
			canvas.iLastY = iY;
		}
	};
	
	var doUpdate = function(code){
		var next = steps.indexOf(curNode);
		dobuild = false;
		direction = 'up';
		switch (code) {
		
			case 33:; // pg up
			case 37:; // left
			case 38: // up
				if (oldLines.length) {
					dobuild = true;
					var temp = oldLines.pop();
					lines.splice(0, 0, temp);
					temp.classList.remove("visible");
				}
				next = next - 1;
				next = next >= 0 ? steps[next] : steps[steps.length - 1];
				
				break;
			case 9:; // tab
			case 32:; // space
			case 34:; // pg down
			case 39:; // right
			case 40: // down
				if (lines.length) {
					dobuild = true;
					var temp = lines.shift();
					temp.classList.add("visible");
					oldLines.push(temp);
				}
				next = next + 1;
				next = next < steps.length ? steps[next] : steps[0];
				direction = 'down';
				break;

		}
		update(next, direction);
		return next;
	};
	/***********事件绑定区域*******************/
	var bindDOM = function(){
		doc.addEventListener("keydown", function(e){
			var code = e.keyCode;
			if (code === 80 || code == 67/* || code==72*/) {
				switch (code) {
					case 80://p
						showPaint();
						break;
					case 67://c
						removePaint();
						break;
				}
				e.preventDefault();
			}
			else 
				if (code === 27 || code === 9 || (code >= 32 && code <= 34) || (code >= 37 && code <= 40)) {
					doUpdate(code);
					e.preventDefault();
				}
		}, false);
		
		win.addEventListener("hashchange", function(){
			if (doHash) {
				update(getElementFromUrl(), 'down');
			}
			else {
				//如果为远程控制需要将id传过去
				if (args.remoteControl) {
					socket && socket.emit('ppt progress', {
						progress: win.location.hash.replace(/^#\/?/, "")
					});
				}
				doHash = true;
			}
			
		}, false);
		
		win.onresize = canvasReady;
		if (args.ctrlId) {
			byId(args.ctrlId).addEventListener('click', function(e){
				var target = e.target;
				if (target.classList.contains('home')) {
					doHash = true;
					win.location.hash = '#cover';
				}
				else if (target.classList.contains('paint')) {
					showPaint();
				}
				else if (target.classList.contains('clearIt')) {
					removePaint();
				}
				
			}, false);
		}
		
	};
	/******************websocket****************/
	var loadJs = function(url, callback){
		var script = doc.createElement('script');
		
		if (typeof callback === 'function') {
			script.onload = callback;
		}
		script.src = url;
		doc.head.appendChild(script);
	}, loadSocketIO = function(callback){
		loadJs('/socket.io/socket.io.js', callback);
	}, doRemoteCTRL = function(){
		socket = io.connect(location.href);
		socket.on('ppt do', function(data){
			switch (data.action) {
				case 'next':
					doUpdate(40, 'down');
					break;
				case 'prev':
					doUpdate(38, 'up');
					break;
			}
			
		});
		socket.on('ppt progress do', function(data){
			//      console.log(data);
			win.location.hash = '#' + data.progress;
			doHash = true;
		//update(getElementFromUrl()||steps[0],'down');
		
		});
		
		//将页面信息传给控制端
		console.log(slideList);
		socket.emit('ppt slide list', {
			list: slideList
		});
	};
    /***************创建slide****************/
	var createSlide = function(slides){
		if (slides.length === 0) {
			return false;
		}
		var $parentNode = doc.createElement('div');
		$parentNode.className = 'slides';
		var html = '';
		slides.forEach(function(obj){
			obj = parseParam(defaultSlide, obj);
			len++;
			var node = doc.createElement('section');
			
			node.className = 'step ' + (obj.border === false ? '' : 'slide');
			var sid = obj.id ? obj.id : 'slide' + len;
			node.id = sid;
			html = obj.content;
			
			var socketID = {
				'id': sid,
				'title': obj.title,
				'content': obj.remark
			};
			
			slideList.push(socketID);
			node.innerHTML = parseExt(html);
			node.setAttribute('data-animate', obj.animate);
			animates.push(obj.animate);
			steps.push(node);
			$parentNode.appendChild(node);
		});
		$slide.appendChild($parentNode);
		byId('loading').className = 'fadeOut';
		$slide.className = 'fadeIn';  
		hljs.initHighlightingOnLoad();
		return true;
	};
	var init = function(){
	
		doc.body.height = "100%", doc.body.overflow = "hidden"
		
		canvas = byId(args.canvasId);
		canvas && (canvas.style.display = 'none');
		
		progress = $$('.progress > span', $slide)[0], bindDOM();
		doHash = true;
		update(getElementFromUrl() || steps[0], 'down');
		
		//开始远程控制，需要nodejs支持哦~
		if (args.remoteControl) {
			if (typeof win.io === 'object' && win.io.connect) {
				doRemoteCTRL();
			}
			else {
				loadSocketIO(doRemoteCTRL);
			}
		}
		
	};
	
  
	win.wSlide = function(opt){
		args = parseParam(args, opt.config);
		if (!args.slideId) {
			alert('need slideId~O(∩_∩)O~');
			return;
		}
		$slide = byId(args.slideId);
		if (!createSlide(opt.slides)) {
			alert('slide~~');
			return;
		}
		
		
		init();
	}
}(document,window);



wSlide(slideData);
