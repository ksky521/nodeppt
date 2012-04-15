
;!function(doc,win){
	/**
	 * 工具函数定义区
	 * @param {Object} el
	 * @param {Object} props
	 */
	 var byId = function ( id ) {
	 	if(typeof id !== 'string' || id === ''){
			return false;
		}
        return doc.getElementById(id);
    },
	$ = function ( selector, context ) {
        context = context || doc;
        return context.querySelector(selector);
    },
	$$ = function ( selector, context ) {
        context = context || doc;
        return toArray( context.querySelectorAll(selector) );
    }, 
	toArray = function(nodelist){
		return [].slice.call(nodelist);
	},getElementFromUrl = function(){
		return byId(win.location.hash.replace(/^#\/?/, ""));
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
	var socket;
	var $slide, 
		steps = [],
		len = 0,
		doHash = true,
		progress,
		curNode,
		prevNode,
		nextNode;
	var lines = [],
		oldLines = lines,
		dobuild = false,
		curLine,
		prevLine,
		nextLine;
	var canvas;
	
	var presentClass,
		pastClass,
		futureClass;
	
	//更新slide主函数
	function update(active,direction){
		if(dobuild){
			return;
		}
		direction = direction || 'down';
		removePaint();//去掉画图
		var index = 0;
		
		if(!~(index = steps.indexOf( active ))){
			index = 0;
			active = steps[0];
			//return;
		}
		curNode = active;
		
		if (active.classList.contains('rebuild')) {
//			console.log(active);
//			console.log(toArray($$('[data-build] > *',active)));
			if (direction === 'down') {
				lines = toArray($$('[data-build] > *', active));
				oldLines = [];
			}
			else {
				oldLines = toArray($$('[data-build] > *.visible', active));
				lines = [];
			}
		} else {
			lines = [];
			oldLines = [];
		}
		
//		console.log(active);
		
		var prev = index - 1;
		prevNode = prev >= 0 ? steps[ prev ] : steps[ len-1 ];
//		console.log(prevNode);
		
		var next = index + 1;
		nextNode = next < len ? steps[ next ] : steps[ 0 ];
//		console.log(nextNode);
		
		clearClass();
		curNode.classList.add(presentClass);
		prevNode.classList.add(pastClass);
		nextNode.classList.add(futureClass);
		//更新进度条
		progress.style.width = ((index+1)/len)*win.innerWidth +'px';
		doHash = false;
		win.location.hash = "#" + active.id;
		
		return false;
	}
	//清除class
	function clearClass(){
		toArray($$('.'+presentClass+',.'+pastClass+',.'+futureClass,$slide)).forEach(function(el){
			el.className = el.className.replace(/(?:\s*past|present|future\s*)/g, '');
		});
	}
	//canvas宽高准备了~
	function canvasReady(){
		if(!canvas){
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
		if(!canvas){
			return;
		}
		canvasReady();
		
		canvas.style.display = '';
		canvas.style.cursor = 'crosshair';
		canvas.addEventListener('mousedown',pMouseDown,false);
		canvas.addEventListener('mouseup',pMouseUp,false);
		canvas.addEventListener('mousemove',pMouseMove,false);
	}
	
	function clearPaint(){
		if(!canvas){
			return;
		}
		canvas.context && canvas.context.clearRect(0, 0, canvas.width, canvas.height);
		canvas.style.display = 'none';
	}
	var removePaint = function(){
		if(!canvas){
			return;
		}
		clearPaint();
		canvas.removeEventListener('mousedown', pMouseDown);
		canvas.removeEventListener('mouseup', pMouseUp);
		canvas.removeEventListener('mousemove', pMouseMove);
	}
	/**
	 * 画图部分事件处理函数
	 * @param {Object} e
	 */
		var pMouseDown = function(e){
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
            //添加ESC键
//                      case 27:
//                          next = steps[steps.length - 1];
//                          break;
        }
        update(next, direction);
		return next;
	}
	var bindDOM = function(){
		//事件绑定区域
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
                if(args.remoteControl){
                    socket && socket.emit('ppt progress',{progress:win.location.hash.replace(/^#\/?/, "")});
                }
				doHash = true;
			}
			
		}, false);
		
		win.onresize = canvasReady;
		if(args.ctrlId){
			byId(args.ctrlId).addEventListener('click', function(e){
				var target = e.target;
				if (target.classList.contains('home')) {
					doHash = true;
					win.location.hash = '#cover';
				}else if (target.classList.contains('paint')) {
					showPaint();
				}else if (target.classList.contains('clearIt')) {
					removePaint();
				}
				
			}, false);
		}
		
	}
	var loadJs = function(url,callback){
		var script = doc.createElement('script');
		
		if(typeof callback==='function'){
			script.onload = callback;
		}
        
        script.src = url;
        doc.head.appendChild(script);
	}
	var loadSocketIO = function(callback){
		loadJs('/socket.io/socket.io.js', callback);
	}, 
	doRemoteCTRL = function(){
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
//			console.log(data);
            win.location.hash = '#'+data.progress;
			doHash = true;
            //update(getElementFromUrl()||steps[0],'down');
			
        });
		
		//将页面信息传给控制端
		var ids = [],count = 0;
		steps.forEach(function(el){
			var $obj = {
				title: $$('.slideTitle', el),
				content: $$('textarea.slideContent', el)
			},obj = {title:'',content:''};
			'title content'.replace(/\S+/g,function(a){
				var b = obj[a], c = $obj[a][0];
				if(c){
					b = c.innerHTML;
				}
				obj[a] = b? b:'no '+a;
			});
			el.id = el.id?el.id:'slide'+count;
			
			var id = {'id':el.id,'title':obj.title,'content':obj.content};
			
			ids.push(id);
			count++;
		});
		socket.emit('ppt slide list', {list:ids});
	};
	var init = function(){
	 	doc.body.height = "100%",
	 	doc.body.overflow = "hidden"
		
		$slide = byId(args.slideId), 
		canvas = byId(args.canvasId);
		canvas && (canvas.style.display = 'none');
		
		progress = $$('.progress > span',$slide)[0],
		
		presentClass = args.presentClass;
		pastClass = args.pastClass;
		futureClass = args.futureClass;
		
		
		steps = toArray($$('.step',$slide));
		
		len = steps.length;
		
		bindDOM();
		doHash = true;
		update(getElementFromUrl()||steps[0],'down');
		
		//开始远程控制，需要nodejs支持哦~
		if(args.remoteControl){
			if(typeof win.io === 'object' && win.io.connect){
				doRemoteCTRL();
			}else{
				loadSocketIO(doRemoteCTRL);
			}
		}
		
	}
	var args = {
		slideId:'slide',
		canvasId:'',
		ctrlId:'',
		presentClass:'present',
		pastClass: 'past',
		remoteControl: false,
		futureClass:'future'
	};
	
	win.wSlide = function(opt){
		args = parseParam(args,opt);
		if(!args.slideId){
			alert('need slideId~O(∩_∩)O~');
			return;
		}
		init();
	}
}(document,window);
wSlide({
	slideId:'slide',
	canvasId:'myCanvas',
	ctrlId:'slideCtrl',
	remoteControl:true
});
