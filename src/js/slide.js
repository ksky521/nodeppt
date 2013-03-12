/**
 * js&css loader
 * 根据seajs核心代码修改而来
 * 该代码整合自MixJS
 */
;!function(global,DOC){
    var _emptyFn = function(){
    }, 
    UA = navigator.userAgent, 
    isWebKit = ~ UA.indexOf('AppleWebKit'), 
    HEAD = DOC.head ||
    DOC.getElementsByTagName('head')[0] ||
    DOC.documentElement;
    /**
     * js和css加载代码
     * 来自 seajs
     * @param {Object} url
     * @param {Object} callback
     * @param {Object} charset
     */
    function createLoad(url, callback, charset,isCSS){
        if(typeof isCSS !=='boolean'){
            isCSS = /\.css(?:\?|$)/i.test(url);
        }
//        var isCSS = /\.css(?:\?|$)/i.test(url);
        var node = DOC.createElement(isCSS ? 'link' : 'script');
        
        typeof callback==='function' && bindOnload(node, callback);
        url = normalize(url);
        if (isCSS) {
            node.rel = 'stylesheet';
            node.href = url;
            HEAD.appendChild(node); // Keep style cascading order
        }
        else {
            node.async = 'async';
            node.src = url;
            charset = charset || 'UTF-8';
            node.type = "text/javascript";
            
            node.charset = charset;
            // For some cache cases in IE 6-9, the script executes IMMEDIATELY after
            // the end of the insertBefore execution, so use `currentlyAddingScript`
            // to hold current node, for deriving url in `define`.
            //          currentlyAddingScript = node;
            HEAD.insertBefore(node, HEAD.firstChild);
            //          currentlyAddingScript = null;
        }
    }
    function bindOnload(node, callback){
        if (node.nodeName === 'SCRIPT') {
            scriptOnload(node, cb);
        }
        else {
            styleOnload(node, cb);
        }
        
        var timer = setTimeout(function(){
            cb();
        }, 2E4);
        
        function cb(){
            if (!cb.isCalled) {
                cb.isCalled = true;
                clearTimeout(timer);
                
                callback();
            }
        }
    }
    //真实url处理
    function realpath(path) {
        path = path.replace(/([^:\/])\/+/g, '$1\/');
        if (path.indexOf('.') === -1) {
            return path;
        }
        var old = path.split('/');
        var ret = [],
        part,
        i = 0,
        len = old.length;
        for (; i < len; i++) {
            part = old[i];
            if (part === '..') {
                if (ret.length === 0) {
                    throw new Error('realpath: url为空');
                }
                ret.pop();
            }
            else if (part !== '.') {
                ret.push(part);
            }
        }
        return ret.join('/');
    }
    //url正常化
    function normalize(url){
        url = realpath(url);
        if (/#$/.test(url)) {
            url = url.slice(0, -1);
        }
        else if (url.indexOf('?') === -1 && !/\.(?:css|js)$/.test(url)) {
            url += '.js';
        }
        return url;
    }
    function scriptOnload(node, callback){
    
        node.onload = node.onerror = node.onreadystatechange = function(){
            if (/loaded|complete|undefined/.test(node.readyState)) {
            
                // 运行一次
                node.onload = node.onerror = node.onreadystatechange = null;
                
                // 内存泄漏
                if (node.parentNode) {
                    try {
                        if (node.clearAttributes) {
                            node.clearAttributes();
                        }
                        else {
                            for (var p in node) 
                                delete node[p];
                        }
                    } 
                    catch (e) {
                    }
                    
                    // Remove the script
                    HEAD.removeChild(node);
                }
                
                // Dereference the node
                node = undefined;
                callback();
            }
        };
        
        // NOTICE:
        // Nothing will happen in Opera when the file status is 404. In this case,
        // the callback will be called when time is out.
    }
    
    function styleOnload(node, callback){
    
        // for IE6-9 and Opera
        if (node.attachEvent) {
            node.attachEvent('onload', callback);
            // NOTICE:
            // 1. "onload" will be fired in IE6-9 when the file is 404, but in
            // this situation, Opera does nothing, so fallback to timeout.
            // 2. "onerror" doesn't fire in any browsers!
        }
        
        // Polling for Firefox, Chrome, Safari
        else {
            setTimeout(function(){
                poll(node, callback);
            }, 0); // Begin after node insertion
        }
        
    }
    function poll(node, callback){
        if (callback.isCalled) {
            return;
        }
        
        var isLoaded;
        
        if (isWebKit) {
            if (node['sheet']) {
                isLoaded = true;
            }
        }
        // for Firefox
        else 
            if (node['sheet']) {
                try {
                    if (node['sheet'].cssRules) {
                        isLoaded = true;
                    }
                } 
                catch (e) {
                    // NS_ERROR_DOM_SECURITY_ERR
                    if (e.code === 1000) {
                        isLoaded = true;
                    }
                }
            }
        
        setTimeout(function(){
            if (isLoaded) {
                // Place callback in here due to giving time for style rendering.
                callback();
            }
            else {
                poll(node, callback);
            }
        }, 1);
    }
    global.loadJS = function(url,callback,charset){
		createLoad(url,callback,charset);
	}
	global.loadCSS = function(url,callback){
		createLoad(url,callback,'utf-8',true);
	}
    global.load = createLoad;
}(window,document);

/**
 * html5 css3 演示ppt
 * @author theowang(三水清)
 * $Id: slide.dev.js 246 2012-06-28 13:58:06Z ksky521@gmail.com $
 */


isControlDevice = typeof isControlDevice === 'undefined'? false:isControlDevice;//是否为控制端
;!function($win,$doc){
	var webSocket, doWebSocket = false, webSocketHost = 'http://123.254.106.78:3000/'+(isControlDevice?'pptcontrol':'pptuser');//'http://192.168.2.4:3000';
	var touchSensitivity = 15;
	var $body = $doc.body;
	var ctrlType = 'bind';
	var doHash = true;
	var touchDX = 0;//touch事件x数据
    var touchDY = 0;//touch事件y数据
	var slideName = 'html5和css3的爱情';
	var stepWidth = 800;//翻页单步宽度
	var curIndex = 0;//当前幻灯片索引
	var $progress = $$('progress');
	var $container = $$('container');//幻灯片容器
	var $slides = toArray($('.slide',$container));//幻灯片集合
	
	var slideCount = $slides.length;//幻灯片总页数-1
	$container.style.width = slideCount*stepWidth + 'px';//设置容器总宽度
	slideCount--;
	
	var $canvasTop = $$('canvasTop');
	
	//设置底部进度条
	function setProgress(){
		$progress.style.width = ((curIndex+1)/(slideCount+1))*100+'%';
	}
	
	//泛数组转换为数组
	function toArray(arrayLike){
        return [].slice.call(arrayLike);
    }
	//封装选择器
	function $(selector,context){
		context = (context && context.nodeType === 1) ? context : $doc;
		return context.querySelectorAll(selector);
	}
	//getID方法
	function $$(id){
		return $doc.getElementById(id);
	}
	
	
	//pc键盘翻页事件逻辑
	function evtDocDown(e){
		var key = e.keyCode;

		switch(key){
			case 80:
				showPaint();
				break;
			case 67://c
                removePaint();
                break;
			//上一页
			case 33:; // pg up
            case 37:; // left
            case 38: // up
                (isControlDevice || ctrlType!=='bindAll') && prevSlide();
                break;
			//下一页
            case 9:; // tab
            case 32:; // space
            case 34:; // pg down
            case 39:; // right
            case 40: // down
                (isControlDevice || ctrlType!=='bindAll') && nextSlide()
                break;
		}
		
//		$container.style.marginLeft = -(curIndex * stepWidth) + 'px';
//		setProgress();
//		setHistory();
	}
	//上一页
	function prevSlide() {
		slideOutCallBack($slides[curIndex]);
		--curIndex < 0 && (curIndex = 0);
		doSlide();
	}
	//下一页
	function nextSlide() {
		if (buildNextItem()) {
			doWebSocket && sendWebSoketMessage({
				donext: curIndex
			});
			return;
		}
		slideOutCallBack($slides[curIndex]);
		++curIndex > slideCount && (curIndex = slideCount);
		doSlide();
		preload($slides[curIndex])($slides[curIndex + 1]);
	}
	//slide转换incallback
	function slideInCallBack() {
		var $cur = $slides[curIndex];
		if (!$cur || ($cur && $cur.nodeType !== 1)) {
			return;
		}
		//如果有data-incallback那么就执行callback
		$cur.dataset.incallback && typeof window[$cur.dataset.incallback] === 'function' && proxyFn($cur.dataset.incallback);
	}
	//slide转换outcallback
	function slideOutCallBack(prev) {
		if (!prev || (prev && prev.nodeType !== 1)) {
			return;
		}
		//如果有data-outcallback那么就执行callback
		prev.dataset.outcallback && typeof window[prev.dataset.outcallback] === 'function' && proxyFn(prev.dataset.outcallback);
	}
	//预加载资源
	function preload(node){
		var self = arguments.callee;
		if(node && node.nodeType===1){
		  var $preload = $('preload',node),len = $preload.length;
		  	while(len--){
				var tmpNode = $preload[len],
				    dataset = $preload[len].dataset, 
				    type = dataset.type,
					url = dataset.url;
				var fn = $win['load'+type.toUpperCase()];
				typeof fn === 'function' && fn(url,function(tmpNode) {
					return function() {
						tmpNode.parentNode && tmpNode.parentNode.removeChild(tmpNode);
						tmpNode = null;
					}
				}(tmpNode));
			}
		}
		return self;
	}
	//单行前进
	function buildNextItem() {
		var toBuild = $('.to-build',$slides[curIndex]);
		if (!toBuild.length) {
			return false;
		}
		toBuild[0].classList.remove('to-build', '');
		
		return true;
	};
	//设置单行页面添加
	function makeBuildLists() {
		var i = slideCount,slide;
		while(slide = $slides[--i]){
			var items = $('.build > *',slide);
			for (var j = 0, item; item = items[j]; j++) {
                if (item.classList) {
                    item.classList.add('to-build');
                }
            }
		}

	};
	
	//切换动画
	function doSlide(slideID){
		slideID = slideID || curIndex;
		$container.style.marginLeft = -(slideID * stepWidth) + 'px';
        setProgress();
		doWebSocket && sendWebSoketMessage({slideID:slideID});
		doHash && ($win.location.hash = "#" + slideID);
		slideInCallBack();
		removePaint();
	}
	
	/********************websocket控制**********************/
	//链接websoket
	function connWebSoket(){
		try{
			if(doWebSocket){
		        doWebSocket = false;
				webSocket = io.connect(webSocketHost);
				
				//系统消息
				webSocket.on('system', function(data){
					doWebSocket = true;
					showTips(data.msg);
					if(data.dowhat==='free'){
						ctrlType = 'bind';
					}
				});
				if (isControlDevice) {
					//如果是控制端，则接收pc端更新消息:update
					webSocket.on('server update', function(data){
						doWebsocketUpdate(data);
					});
					webSocket.on('client handle', function(data){
                        if(data.handleFnName && typeof window[data.handleFnName] === 'function'){
							window[data.handleFnName].call({},data.args);
						}
                    });
					
					
				}else{
					//如果是pc端，则接收控制消息:order
					webSocket.on('server order', function(data){
                        doWebsocketUpdate(data);
                    });
					webSocket.on('server handle', function(data){
                        if(data.handleFnName && typeof window[data.handleFnName] === 'function'){
                            window[data.handleFnName].apply({},data.args);
                        }
                    });
					
					webSocket.on('server control message',function(data){
                        switch(data.state){
                            case 'bind'://完全同步
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
		}catch(e){
			throw new Error('websocket connect error!');
		}
	}
	//控制状态
	function sendControlState(state){
		//bind
		//bindAll
		//unbind
		
		if( isControlDevice && doWebSocket && webSocket){
			ctrlType = state;
            webSocket.emit('server bind update',{state:state});
			'bind bindAll unbind'.replace(/\S+/g,function(a){
				$$(a).classList.remove('orange');
				if(state===a){
					$$(state).classList.add('orange');
				}
			});
        }
	}
	
	//控制端代码=========================>
	function doWebsocketUpdate(data){
		//控制端
		doWebSocket = 0;
		if (data.donext && curIndex === data.donext) {
			nextSlide();
			doWebSocket = 1;
			return;
		}
		curIndex = data.slideID;
		
        doSlide();
		preload($slides[curIndex])($slides[curIndex+1]);
        doWebSocket = 1;
	}
	
	//<==========end===========控制端代码
	
	//pc端代码========================>
//	function doOrder(data){
//		curIndex = data.slideID;
//		doWebSocket = 0;
//        doSlide();
//		doWebSocket = 1;
//	}
	
	//<==========end==============pc端代码
    //显示tips
	function showTips(msg){
		$$('slideTip').innerHTML = msg;
		$$('slideTip').style.display = 'block';
		setTimeout(function(){
			$$('slideTip').style.display = 'none';
		},3E3);
	}
	
	//发送webSocket消息
	function sendWebSoketMessage(json){
		if(doWebSocket && webSocket && ctrlType!=='unbind'){
			
			webSocket.emit(isControlDevice?'order':'update',json);
		}
	}
	//发送webSocket执行函数命令
	function sendWebSoketOrder(handleFnName,args){
//		console.log(handleFnName);
		if(doWebSocket && webSocket && ctrlType!=='unbind'){
//			console.log('send order');
            
            webSocket.emit(isControlDevice?'handle by server':'handle by client',{handleFnName:handleFnName,args:args});
        }
	}
	
	//绑定事件
	function bindEvent(){
		$doc.addEventListener('keyup',evtDocDown,false);
		$body.addEventListener('touchstart', evtTouchStart, false);
		!isControlDevice && bindHelp();
		$win.addEventListener('hashchange',function(){
			if(location.hash){
				doHash = false;
				slideOutCallBack($slides[curIndex]);
	            curIndex = location.hash.substr(1) | 0;
				doSlide();
	            doHash = true;
			}
			
		},true);
//		$win.addEventListener('popstate', evtHistory, false);
	}
	//绑定显示help层事件
	function bindHelp(){
		var $btn = $('.helpBtn',$$('helpContainer'));
		if($btn[0]){
			$btn[0].addEventListener('click',function(){
				var style = $$('helpContainer').style;
				if(parseInt(style.marginLeft,10)<0){
					style.marginLeft = 0;
				}else{
					style.marginLeft = '-570px';
				}
			},true);
			$$('helpContainer').style.marginLeft = '-570px';
		}
	}
	//初始化
	function init(){
		if(doWebSocket){
			loadJS('js/socket.io.js',connWebSoket);
		}
		makeBuildLists();
		bindEvent();
		
		if(location.hash && (curIndex = (location.hash.substr(1)|0))){
			doSlide();
        }else{
			setProgress();
			slideInCallBack();
		}
		preload($slides[curIndex])($slides[curIndex+1]);
	}
	
	/******************************** Touch events *********************/
	function evtTouchStart(event){
		if (event.touches.length == 1) {
			touchDX = 0;
			touchDY = 0;
			
			touchStartX = event.touches[0].pageX;
			touchStartY = event.touches[0].pageY;
			//捕获，尽早发现事件
			$body.addEventListener('touchmove', evtTouchMove, true);
			$body.addEventListener('touchend', evtTouchEnd, true);
		}
	};
	//touch事件
	function evtTouchMove(event){
		if (event.touches.length > 1) {
			cancelTouch();
		}
		else {
			touchDX = event.touches[0].pageX - touchStartX;
			touchDY = event.touches[0].pageY - touchStartY;
		}
	};
	//touchend事件
	function evtTouchEnd(event){
		var dx = Math.abs(touchDX);
		var dy = Math.abs(touchDY);
		
		if ((dx > touchSensitivity) && (dy < (dx * 2 / 3))) {
			if (touchDX > 0) {
				prevSlide();
			}
			else {
				nextSlide();
			}
		}
		cancelTouch();
	};
	//取消绑定
	function cancelTouch(){
		$body.removeEventListener('touchmove', evtTouchMove, true);
		$body.removeEventListener('touchend', evtTouchEnd, true);
	};
	
	var drawCanvas = $$('drawCanvas');
    drawCanvas && (drawCanvas.style.display = 'none') && ($doc.onselectstart = function(){return false});
	
	
	/***********画图部分事件处理函数************/
	//画图前准备
    function drawCanvasReady(){
        if (!drawCanvas) {
            return;
        }
        drawCanvas.context = drawCanvas.getContext('2d');
        drawCanvas.context.lineWidth = 3;
        drawCanvas.context.lineCap = 'round';
        drawCanvas.context.strokeStyle = "red";
    }
	//显示画板
    function showPaint(){
        if (!drawCanvas) {
            return;
        }
        drawCanvasReady();
        drawCanvas.style.display = '';
		
        drawCanvas.addEventListener('mousedown', pMouseDown, true);
        drawCanvas.addEventListener('mouseup', pMouseUp, true);
        drawCanvas.addEventListener('mousemove', pMouseMove, true);
		
    }
    //清除画板内容
    function clearPaint(){
        if (!drawCanvas) {
            return;
        }
        drawCanvas.context && drawCanvas.context.clearRect(0, 0, 800, 600);
        drawCanvas.style.display = 'none';
    }
	//删除画板
    var removePaint = function(){
        if (!drawCanvas) {
            return;
        }
        clearPaint();
        drawCanvas.removeEventListener('mousedown', pMouseDown);
        drawCanvas.removeEventListener('mouseup', pMouseUp);
        drawCanvas.removeEventListener('mousemove', pMouseMove);
    }, pMouseDown = function(e){
        drawCanvas.isMouseDown = true;
//        drawCanvas.iLastX = e.clientX - drawCanvas.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft);
//        drawCanvas.iLastY = e.clientY - drawCanvas.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop);
        drawCanvas.iLastX =e.layerX || e.offsetX || (e.clientX - drawCanvas.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft));
		drawCanvas.iLastY = e.layerY || e.offsetY || (e.clientY - drawCanvas.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop));
    }, pMouseUp = function(){
        drawCanvas.isMouseDown = false;
        drawCanvas.iLastX = -1;
        drawCanvas.iLastY = -1;
    }, pMouseMove = function(e){
        if (drawCanvas.isMouseDown) {
//            var iX = e.clientX - drawCanvas.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft);
//            var iY = e.clientY - drawCanvas.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop);
            var iX = e.layerX || e.offsetX || (e.clientX - drawCanvas.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft));
			var iY = e.layerY || e.offsetY || (e.clientY - drawCanvas.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop));
			drawCanvas.context.beginPath();
            drawCanvas.context.moveTo(drawCanvas.iLastX, drawCanvas.iLastY);
            drawCanvas.context.lineTo(iX, iY);
            drawCanvas.context.stroke();
            drawCanvas.iLastX = iX;
            drawCanvas.iLastY = iY;
        }
    };
	
	//代理函数
	function proxyFn(fnName,args){
		if(isControlDevice){
			
			doWebSocket && ctrlType!=='unbind' && sendWebSoketOrder(fnName,args);
		}else if(typeof window[fnName] === 'function'){
			window[fnName](args);
		}
	}
	
	init();
	
	$win.slide = {
		nextSlide:nextSlide,
		prevSlide:prevSlide,
		sendControlState:sendControlState,
		sendWebSoketOrder:sendWebSoketOrder
	};
	$win.proxyFn = proxyFn;
}(window,document);



