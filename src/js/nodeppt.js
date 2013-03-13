;(function($win,$doc){
	var $body = $doc.body;
	var emptyFn = function(){};
	var emptyArr = [];
	var webSocket, 
		doWebSocket = false, 
		webSocketHost;
	var touchSensitivity = 15;
	var ctrlType = 'bind';
	var doHash = true;
	var touchDX = 0;//touch事件x数据
    var touchDY = 0;//touch事件y数据
	var slideWidth;//单页宽度
	var slideHeight;
	var curIndex = 0;//当前幻灯片索引
	var $progress;//进度条
	var $container;//幻灯片容器
	var $slides;//幻灯片集合
	var $drawBoard;//画板
	

	var slideCount;//幻灯片总页数-1

	
	
	//设置底部进度条
	function setProgress(){
		$progress.style.width = ((curIndex+1)/(slideCount+1))*100+'%';
	}

	//泛数组转换为数组
	function toArray(arrayLike){
        return emptyArr.slice.call(arrayLike);
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
		$cur.dataset.incallback && typeof $win[$cur.dataset.incallback] === 'function' && proxyFn($cur.dataset.incallback);
	}
	//slide转换outcallback
	function slideOutCallBack(prev) {
		if (!prev || (prev && prev.nodeType !== 1)) {
			return;
		}
		//如果有data-outcallback那么就执行callback
		prev.dataset.outcallback && typeof $win[prev.dataset.outcallback] === 'function' && proxyFn(prev.dataset.outcallback);
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
	}
	//设置单行页面添加
	function makeBuildLists() {
		var i = slideCount,slide;
		var transition = defaultOptions.transition;
		while(slide = $slides[--i]){
			var items = $('.build > *',slide);
			for (var j = 0, item; item = items[j]; j++) {
				var t = item.classList
                if (t) {
                    t.add('to-build');
                }
            }
            slide.dataset.transition = transition;
		}

	}
	
	//切换动画
	function doSlide(slideID){
		slideID = slideID || curIndex;
		// $container.style.marginLeft = -(slideID * slideWidth) + 'px';
		updateSlideClass();
        setProgress();
		doWebSocket && sendWebSoketMessage({slideID:slideID});
		doHash && ($win.location.hash = "#" + slideID);
		slideInCallBack();
		removePaint();
	}
	function updateSlideClass(){
         var curSlide = curIndex;
          for (var i = 0,len = $slides.length; i < len; ++i) {
            switch (i) {
              case curSlide - 2:
                updateSlideClass_(i, 'far-past');
                break;
              case curSlide - 1:
                updateSlideClass_(i, 'past');
                break;
              case curSlide:
                updateSlideClass_(i, 'current');
                break;
              case curSlide + 1:
                updateSlideClass_(i, 'next');
                break;
              case curSlide + 2:
                updateSlideClass_(i, 'far-next');
                break;
              default:
                updateSlideClass_(i);
                break;
            }
          }
    }
    function updateSlideClass_(slideNo, className) {
        var el = $slides[slideNo];

        if(!el) {
            return;
        }

        if(className) {
            el.classList.add(className);
        }
        var arr = ['next','past','far-next','far-past','current'];

        for(var i = 0, slideClass; slideClass = arr[i]; ++i) {
            if(className != slideClass) {
                el.classList.remove(slideClass);
            }
        }
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
				if (defaultOptions.isControlDevice) {
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
		if( defaultOptions.isControlDevice && defaultOptions.doWebSocket && webSocket){
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
		if(!$slideTip){
			return;
		}
		$slideTip.innerHTML = msg;
		$slideTip.style.display = 'block';
		setTimeout(function(){
			$slideTip.style.display = 'none';
		},3E3);
	}
	
	//发送webSocket消息
	function sendWebSoketMessage(json){
		if(doWebSocket && webSocket && ctrlType!=='unbind'){
			
			webSocket.emit(defaultOptions.isControlDevice?'order':'update',json);
		}
	}
	//发送webSocket执行函数命令
	function sendWebSoketOrder(handleFnName,args){
//		console.log(handleFnName);
		if(doWebSocket && webSocket && ctrlType!=='unbind'){
//			console.log('send order');
            
            webSocket.emit(defaultOptions.isControlDevice?'handle by server':'handle by client',{handleFnName:handleFnName,args:args});
        }
	}
	/*************************events***************/
	
	
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
			case 33: // pg up
            case 37: // left
            case 38: // up
                (defaultOptions.isControlDevice || ctrlType!=='bindAll') && prevSlide();
                break;
			//下一页
            case 9: // tab
            case 32: // space
            case 34: // pg down
            case 39: // right
            case 40: // down
                (defaultOptions.isControlDevice || ctrlType!=='bindAll') && nextSlide()
                break;
		}
		
//		$container.style.marginLeft = -(curIndex * slideWidth) + 'px';
//		setProgress();
//		setHistory();
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
	}
	//touch事件
	function evtTouchMove(event){
		if (event.touches.length > 1) {
			cancelTouch();
		}
		else {
			touchDX = event.touches[0].pageX - touchStartX;
			touchDY = event.touches[0].pageY - touchStartY;
		}
	}
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
	}
	//取消绑定
	function cancelTouch(){
		$body.removeEventListener('touchmove', evtTouchMove, true);
		$body.removeEventListener('touchend', evtTouchEnd, true);
	}
	//绑定事件
	function bindEvent(){
		$doc.addEventListener('keyup',evtDocDown,false);
		$body.addEventListener('touchstart', evtTouchStart, false);
		
		$win.addEventListener('hashchange',function(){
			if(location.hash){
				doHash = false;
				slideOutCallBack($slides[curIndex]);
				curIndex = location.hash.substr(1) | 0;
				doSlide();
				doHash = true;
			}
			
		},true);
	}
	
	
	/***********画图部分事件处理函数************/
	//画图前准备
    function drawCanvasReady(){
        if (!$drawBoard) {
            return;
        }
        $drawBoard.context = $drawBoard.getContext('2d');
        $drawBoard.context.lineWidth = 3;
        $drawBoard.context.lineCap = 'round';
        $drawBoard.context.strokeStyle = "red";
    }
	//显示画板
    function showPaint(){
        
        drawCanvasReady();
        $drawBoard.style.display = '';
		
        $drawBoard.addEventListener('mousedown', pMouseDown, true);
        $drawBoard.addEventListener('mouseup', pMouseUp, true);
        $drawBoard.addEventListener('mousemove', pMouseMove, true);
		
    }
    //清除画板内容
    function clearPaint(){
       
        $drawBoard.context && $drawBoard.context.clearRect(0, 0, slideWidth, slideHeight);
        $drawBoard.style.display = 'none';
    }
	//删除画板
    var removePaint = function(){
        clearPaint();
        $drawBoard.removeEventListener('mousedown', pMouseDown);
        $drawBoard.removeEventListener('mouseup', pMouseUp);
        $drawBoard.removeEventListener('mousemove', pMouseMove);
    }, 
    pMouseDown = function(e){
        $drawBoard.isMouseDown = true;
//        $drawBoard.iLastX = e.clientX - $drawBoard.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft);
//        $drawBoard.iLastY = e.clientY - $drawBoard.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop);
        $drawBoard.iLastX =e.layerX || e.offsetX || (e.clientX - $drawBoard.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft));
		$drawBoard.iLastY = e.layerY || e.offsetY || (e.clientY - $drawBoard.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop));
    }, 
    pMouseUp = function(){
        $drawBoard.isMouseDown = false;
        $drawBoard.iLastX = -1;
        $drawBoard.iLastY = -1;
    }, 
    pMouseMove = function(e){
        if ($drawBoard.isMouseDown) {
//            var iX = e.clientX - $drawBoard.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft);
//            var iY = e.clientY - $drawBoard.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop);
            var iX = e.layerX || e.offsetX || (e.clientX - $drawBoard.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft));
			var iY = e.layerY || e.offsetY || (e.clientY - $drawBoard.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop));
			$drawBoard.context.beginPath();
            $drawBoard.context.moveTo($drawBoard.iLastX, $drawBoard.iLastY);
            $drawBoard.context.lineTo(iX, iY);
            $drawBoard.context.stroke();
            $drawBoard.iLastX = iX;
            $drawBoard.iLastY = iY;
        }
    };
	
	//代理函数
	function proxyFn(fnName,args){
		if(defaultOptions.isControlDevice){
			
			doWebSocket && ctrlType!=='unbind' && sendWebSoketOrder(fnName,args);
		}else if(typeof $win[fnName] === 'function'){
			$win[fnName](args);
		}
	}

	/**
	 * 默认配置
	 * @type {Object}
	 */
	var defaultOptions = {
		containerID:'container',
		isControlDevice:false,
		doWebSocket:true,
		drawBoardID:'drawBoard',
		slideClass:'.slide',
		buildClass:'.build',
		progressID:'progress',
		transition:'',
		tipID:'tip',
		webSocketHost:'',
		width:900,
		height:700
	};
	
    //初始化变量
	function initVar(){
		
		$slideTip = $$(defaultOptions.tipID);
		$container =  $$(defaultOptions.containerID);
		slideWidth = defaultOptions.width;
		slideHeight = defaultOptions.height;
		$progress = $$(defaultOptions.progressID);
		$slides = toArray($(defaultOptions.slideClass,$container));
		slideCount = $slides.length;//幻灯片总页数-1
		// $container.style.width = slideCount*slideWidth + 'px';//设置容器总宽度
		slideCount--;
		$drawBoard = $$(defaultOptions.drawBoardID);
		if($drawBoard){
			$drawBoard.style.display = 'none';
			$drawBoard.width = slideWidth;
			$drawBoard.height = slideHeight;
			$doc.onselectstart = function(){return false}
		}
	}
	//初始化
	function init(options){
		options = options || {};

		for(var key in defaultOptions) {
            if(!!(key in options)) {
                defaultOptions[key] = options[key];
            }
        }

		initVar();//初始化变量

		if(defaultOptions.doWebSocket && defaultOptions.webSocketHost!==''){
			doWebSocket = 1;
			webSocketHost = defaultOptions.webSocketHost+(defaultOptions.isControlDevice?'pptcontrol':'pptuser');//'http://192.168.2.4:3000'
			loadJS('js/socket.io.js',connWebSoket);
		}else{
			doWebSocket = 0;
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
		$body.style.opacity = 1;
	}
	$win.slide = {
		init:init,
		next:nextSlide,
		prev:prevSlide,
		sendState:sendControlState,
		sendOrder:sendWebSoketOrder
	};
	$win.proxyFn = proxyFn;
	
}(window,document));