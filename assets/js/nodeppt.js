(function($win, $doc, $B, loadJS, loadCSS, undefined) {
    //用于单页ppt预加载资源
    var preloadFn = {
        loadJS: loadJS,
        loadCSS: loadCSS
    };

    var $body = $doc.body;
    var emptyFn = function() {};
    var emptyArr = [];

    var touchDX = 0; //touch事件x数据
    var touchDY = 0; //touch事件y数据
    var touchStartX = 0;
    var touchStartY = 0;
    var ISSYNC = false;

    var ctrlType = 'bind';
    var doHash = true;
    var lockSlide = false;
    var slideWidth; //单页宽度
    var slideHeight;
    var curIndex = 0; //当前幻灯片索引
    var pastIndex = 0; //上一个幻灯片索引
    var $progress; //进度条
    var $container; //幻灯片容器
    var $slides; //幻灯片集合
    var $drawBoard; //画板
    var $slideTip;
    var slideCount; //幻灯片总页数-1

    //设置底部进度条

    function setProgress() {
        //添加dataset
        Slide.current = curIndex + 1;
        if ($progress) {
            $progress.style.width = ((curIndex + 1) / (slideCount + 1)) * 100 + '%';
        }
    }

    //泛数组转换为数组

    function toArray(arrayLike) {
            return emptyArr.slice.call(arrayLike);
        }
        //封装选择器

    function $(selector, context) {
            context = (context && context.nodeType === 1) ? context : $doc;
            return context.querySelectorAll(selector);
        }
        //getID方法

    function $$(id) {
        return $doc.getElementById(id);
    }


    //上一页
    function prevSlide() {

            slideOutCallBack($slides[curIndex]);
            pastIndex = curIndex;
            --curIndex < 0 && (curIndex = 0);
            doSlide();
        }
        //下一页
    function nextSlide() {
            if (buildNextItem()) {
                // $B.fire('slide change ID',{
                //    slideID:curIndex
                // })
                return;
            }
            slideOutCallBack($slides[curIndex]);
            pastIndex = curIndex;
            ++curIndex > slideCount && (curIndex = slideCount);
            doSlide();
            preload($slides[curIndex])($slides[curIndex + 1]);
        }
        //slide切入回调incallback
        //<slide data-incallback=""
    var slideInTimer;

    function slideInCallBack() {
        if (slideInTimer) {
            clearTimeout(slideInTimer);
        }
        slideInTimer = setTimeout(slideInCallBack_, 1500);

    }

    function slideInCallBack_() {
            var $cur = $slides[curIndex];
            if (!$cur || ($cur && $cur.nodeType !== 1)) {
                return;
            }
            var cb = $cur.dataset.incallback;
            //如果有data-incallback那么就执行callback
            cb && typeof $win[cb] === 'function' && proxyFn(cb);
            //检测iframe
            var $iframe = toArray($('iframe[data-src]', $cur));
            if ($iframe.length) {
                $iframe.forEach(function(v) {
                    var src = v.dataset.src;
                    v.src = src;
                });

            }
        }
        //slide切出回调outcallback
        //<slide data-outcallback=""
    var slideOutTimer;

    function slideOutCallBack(prev) {
        if (!prev || (prev && prev.nodeType !== 1)) {
            return;
        }
        if (slideOutTimer) {
            clearTimeout(slideOutTimer);
        }
        slideOutTimer = setTimeout(function() {
            slideOutCallBack_(prev);
        }, 1500);
    }

    function slideOutCallBack_(prev) {
        var cb = prev.dataset.outcallback;
        //如果有data-outcallback那么就执行callback
        cb && typeof $win[cb] === 'function' && proxyFn(cb);
    }

    //预加载资源
    //<preload data-type="js||css" data-url="">

    function preload(node) {
            var self = arguments.callee;
            if (node && node.nodeType === 1) {
                var $preload = $('preload', node),
                    len = $preload.length;
                while (len--) {
                    var tmpNode = $preload[len],
                        dataset = tmpNode.dataset,
                        type = dataset.type,
                        url = dataset.url;
                    var fn = preloadFn['load' + type.toUpperCase()];
                    typeof fn === 'function' && fn(url, function(tmpNode) {
                        return function() {
                            //将该标签删除，释放内存
                            tmpNode.parentNode && tmpNode.parentNode.removeChild(tmpNode);
                            tmpNode = null;
                        };
                    }(tmpNode));
                }
            }
            return self;
        }
        //单行前进

    function buildNextItem() {
        if ($body.classList.contains('overview')) {
            return false;
        }
        $curSlide = $slides[curIndex];
        var builded = toArray($('.building'), $curSlide);
        var list;
        if (builded.length) {

            while (list = builded.shift()) {
                list = list.classList
                list.remove('building');
                list.add('build-fade');
            }
        }
        var toBuild = $('.to-build', $curSlide);

        if (!toBuild.length) {
            return false;
        }

        var item = toBuild.item(0);
        $B.fire('slide do build', {
            slideID: curIndex,
            build: item.dataset.index
        })
        list = item.classList;
        $B.fire('slide.update',curIndex|0, item.dataset.index|0+1);
        list.remove('to-build');
        list.add('building');

        return true;
    }

    //设置单行页面添加

    function makeBuildLists() {
        var i = slideCount;
        var slide;
        var transition = defaultOptions.transition;
        var buildClass = '.build > *,.fadeIn > *,.moveIn > *,.bounceIn > *,.zoomIn > *,.fade > *';
        while (slide = $slides[i--]) {
            var items = $(buildClass, slide);
            var dataset = slide.dataset;
            for (var j = 0, item; item = items[j]; j++) {
                var t = item.classList
                if (t) {
                    t.add('to-build');
                    item.dataset.index = j;
                }
            }
            if (!dataset.transition) {
                dataset.transition = transition;
            }
        }

    }

    //切换动画

    function doSlide(slideID, isSync) {
        ISSYNC = typeof isSync === 'boolean' ? isSync : true;
        slideID = slideID === undefined ? curIndex : (slideID | 0);
        curIndex = slideID;

        // $container.style.marginLeft = -(slideID * slideWidth) + 'px';
        updateSlideClass();
        setProgress();
        //发布slide切换状态广播
        ISSYNC && $B.fire('slide change ID', {
            slideID: slideID
        });
        if (doHash) {
            lockSlide = true;
            $win.location.hash = "#" + slideID;
        }
        slideInCallBack();
        removePaint();

        if ($doc.body.classList.contains('overview')) {
            focusOverview_();
            return;
        }else if(!$doc.body.classList.contains('popup')){
            $doc.body.classList.remove('with-notes');
        }

    }

    function updateSlideClass() {
        var curSlide = curIndex;
        var pageClass = 'pagedown';
        if (pastIndex === curIndex) {
            $cur = $slides[curIndex];
            if ($cur.classList.contains('pageup')) {
                return;
            }
        }
        if (pastIndex > curIndex) {
            //往前翻页
            pageClass = 'pageup';
        } else {
            //往后翻页
        }
        for (var i = 0, len = $slides.length; i < len; ++i) {
            switch (i) {
                case curSlide - 2:
                    updateSlideClass_(i, 'far-past', pageClass);
                    break;
                case curSlide - 1:
                    updateSlideClass_(i, 'past', pageClass);
                    break;
                case curSlide:
                    updateSlideClass_(i, 'current', pageClass);
                    break;
                case curSlide + 1:
                    updateSlideClass_(i, 'next', pageClass);
                    break;
                case curSlide + 2:
                    updateSlideClass_(i, 'far-next', pageClass);
                    break;
                default:
                    updateSlideClass_(i);
                    break;
            }
        }
        $B.fire('slide.update', curIndex,0, pageClass);

    }

    function overview(isFromControl) {
        $body.classList.toggle('overview');
        focusOverview_();
        if (!isFromControl) {
            $B.fire('overview');
        }
    }

    function focusOverview_() {
        var isOV = $doc.body.classList.contains('overview');
        for (var i = 0, slide; slide = $slides[i]; i++) {
            slide.style.transform = slide.style.webkitTransform = slide.style.msTransform = slide.style.mozTransform = isOV ?
                'translateZ(-2500px) translate(' + ((i - curIndex) * 105) +
                '%, 0%)' : '';
            slide.style.animation = slide.style.webkitAnimation = slide.style.msAnimation = slide.style.mozAnimation = isOV ?
                'none' : '';
        }
    }

    function updateSlideClass_(slideNo, className, pageClass) {
        var el = $slides[slideNo];

        if (!el) {
            return;
        }
        if (className) {
            el.classList.add(className);
        }
        if (pageClass && location.href.indexOf('_multiscreen=control') === -1 && location.href.indexOf('iscontroller=1') === -1) {
            el.classList.add(pageClass);
        }

        var arr = ['next', 'past', 'far-next', 'far-past', 'current', 'pagedown', 'pageup'];
        arr.forEach(function(v) {
            if (className !== v && pageClass !== v) {
                el.classList.remove(v);
            }
        });

    }

    //显示tips

    function showTips(msg) {
        if (!$slideTip) {
            return;
        }
        $slideTip.innerHTML = msg;
        $slideTip.style.display = 'block';
        setTimeout(function() {
            $slideTip.style.display = 'none';
        }, 3E3);
    }


    /*************************events***************/

    //pc键盘翻页事件逻辑

    function evtDocUp(e) {
            var key = e.keyCode;
            var target = e.target;
            //防止input和textarea，和可以编辑tag
            if (/^(input|textarea)$/i.test(target.nodeName) || target.isContentEditable) {
                return;
            }
            if (!e.isFromControl) {
                switch (key) {
                    case 13:
                    case 72:
                    case 87:
                    case 79:
                    case 78:
                    case 80:
                    case 67:
                        $B.fire('slide event keyup', e);
                        break;
                }
            }
            switch (key) {
                case 13:
                    // Enter
                    if ($doc.body.classList.contains('overview')) {
                        overview(e.isFromControl);
                    }

                    break;
                case 72:
                    // H: Toggle code highlighting
                    $doc.body.classList.toggle('highlight-code');
                    setTimeout(function() {
                        $doc.body.classList.toggle('highlight-code');
                    }, 2000);
                    break;
                    // 下掉宽屏模式，默认width：100%
                case 87:
                    // W: Toggle widescreen
                    // Only respect 'w' on body. Don't want to capture keys from an <input>.
                    if (!(e.shiftKey && e.metaKey)) {
                        if (!$body.classList.contains('popup'))
                            $container.classList.toggle('layout-widescreen');
                    }
                    break;
                case 79:
                    // O: Toggle overview
                    overview(e.isFromControl);

                    break;
                case 78:
                    // N
                    if (!$body.classList.contains('popup'))
                        $doc.body.classList.toggle('with-notes');
                    break;
                case 80:
                    //P
                    if (!$body.classList.contains('popup')) {
                        showPaint(e.isFromControl);
                    }
                    break;
                case 67:
                    //c
                    if (!$body.classList.contains('popup')) {
                        removePaint(e.isFromControl);
                    }
                    break;
                    //上一页
                case 33:
                    // pg up
                case 37:
                    // left
                case 38:
                    // up
                    prevSlide();
                    break;
                    //下一页
                    // case 9:
                    // tab
                case 32:
                    // space
                case 34:
                    // pg down
                case 39:
                    // right
                case 40:
                    // down
                    nextSlide()
                    break;
            }

            //        $container.style.marginLeft = -(curIndex * slideWidth) + 'px';
            //        setProgress();
            //        setHistory();
        }
        /******************************** Touch events *********************/
    var isStopTouchEvent = false;

    function evtTouchStart(event) {
            if (!isStopTouchEvent && event.touches.length === 1) {
                touchDX = 0;
                touchDY = 0;
                var touch = event.touches[0];
                touchStartX = touch.pageX;
                touchStartY = touch.pageY;
                //捕获，尽早发现事件
                $body.addEventListener('touchmove', evtTouchMove, true);
                $body.addEventListener('touchend', evtTouchEnd, true);
            }
        }
        //touch事件

    function evtTouchMove(event) {
            if (event.touches.length > 1) {
                cancelTouch();
            } else {
                var touch = event.touches[0];

                touchDX = touch.pageX - touchStartX;
                touchDY = touch.pageY - touchStartY;
            }
            event.preventDefault();

        }
        //touchend事件

    function evtTouchEnd(event) {
            var dx = Math.abs(touchDX);
            var dy = Math.abs(touchDY);

            if ((dx > 15) && (dy < (dx * 2 / 3))) {
                if (touchDX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
            cancelTouch();
        }
        //取消绑定

    function cancelTouch() {
            $body.removeEventListener('touchmove', evtTouchMove, true);
            $body.removeEventListener('touchend', evtTouchEnd, true);
        }
        //绑定事件

    function bindEvent() {
        $doc.addEventListener('keyup', evtDocUp, false);
        $body.addEventListener('touchstart', evtTouchStart, false);
        $$('_btn-bar').addEventListener('click', function() {
            var isOpen = false;
            return function() {
                if (!isOpen) {
                    this.classList.remove('fa-bars');
                    this.classList.add('fa-close');
                    $$('_btn-box').style.display = 'inline-block';
                } else {
                    this.classList.remove('fa-close');
                    this.classList.add('fa-bars');
                    $$('_btn-box').style.display = 'none';

                }
                isOpen = !isOpen;
            };
        }(), false);
        $$('_btn-prev').addEventListener('click', prevSlide, false);
        $$('_btn-next').addEventListener('click', nextSlide, false);
        $$('_btn-overview').addEventListener('click', function() {
            var isOpen = false;
            return function() {

                if (isOpen) {
                    this.classList.add('fa-compress');
                    this.classList.remove('fa-expand');
                } else {
                    this.classList.add('fa-expand');
                    this.classList.remove('fa-compress');
                }

                overview();
                isOpen = !isOpen;
            };
        }(), false);
        $$('_btn-brush').addEventListener('click', function() {
            var isOpen = false;
            return function() {
                if (isOpen) {
                    this.classList.add('fa-paint-brush');
                    this.classList.remove('fa-eraser');
                    removePaint();
                } else {
                    showPaint();
                    this.classList.add('fa-eraser');
                    this.classList.remove('fa-paint-brush');
                }
                isOpen = !isOpen;
            }
        }(), false);

        $win.addEventListener('hashchange', function() {
            if (location.hash && !lockSlide) {
                doHash = false;
                slideOutCallBack($slides[curIndex]);
                pastIndex = curIndex;
                curIndex = location.hash.substr(1) | 0;

                doSlide();
                doHash = true;
            }
            lockSlide = false;
        }, true);
    }


    /***********画图部分事件处理函数************/
    //画图前准备

    function drawCanvasReady() {
            $drawBoard.context = $drawBoard.getContext('2d');
            var context = $drawBoard.context;
            context.lineWidth = 3;
            context.lineCap = 'round';
            context.strokeStyle = "red";
        }
        //显示画板
    var isControl = 0;

    function showPaint(isFromControl) {
            if (!$drawBoard) {
                return;
            }

            //1、将翻页停止
            isStopTouchEvent = true;
            //2、将管理模式去掉
            if ($body.classList.contains('with-notes')) {
                isControl = 1;
                $body.classList.remove('with-notes');
                $body.classList.remove('popup');
            }
            $drawBoard.width = $body.clientWidth;
            $drawBoard.height = $body.clientHeight;
            drawCanvasReady();

            $drawBoard.style.display = '';
            $container.style.overflow = 'hidden';

            $drawBoard.addEventListener('mousedown', pMouseDown, true);
            $drawBoard.addEventListener('mouseup', pMouseUp, true);
            $drawBoard.addEventListener('mousemove', pMouseMove, true);
            //滑动
            $drawBoard.addEventListener('touchmove', pMouseMove, true);
            $drawBoard.addEventListener('touchend', pMouseUp, true);
            $drawBoard.addEventListener('touchcancel', pMouseUp, true);
            $drawBoard.addEventListener('touchstart', pMouseDown, true);

            $doc.addEventListener('selectstart', stopSelect, true);
            if (!isFromControl) {
                $B.fire('show paint');
            }
        }
        //禁止选中

    function stopSelect() {
            return false;
        }
        //清除画板内容

    function clearPaint() {
            $container.style.overflow = '';
            $drawBoard.context && $drawBoard.context.clearRect(0, 0, slideWidth, slideHeight);
            $drawBoard.style.display = 'none';
        }
        //删除画板
    var removePaint = function(isFromControl) {
        clearPaint();
        if (isControl) {
            $body.classList.add('with-notes');
            $body.classList.add('popup');
        }
        isStopTouchEvent = false;
        $drawBoard.removeEventListener('mousedown', pMouseDown);
        $drawBoard.removeEventListener('mouseup', pMouseUp);
        $drawBoard.removeEventListener('mousemove', pMouseMove);
        //滑动
        $drawBoard.removeEventListener('touchstart', pMouseDown);
        $drawBoard.removeEventListener('touchmove', pMouseMove);
        $drawBoard.removeEventListener('touchend', pMouseUp);
        $drawBoard.removeEventListener('touchcancel', pMouseUp);


        $doc.removeEventListener('selectstart', stopSelect, true);
        if (!isFromControl) {
            $B.fire('remove paint');
        }
    };
    var pMouseDown = function(e) {
        $drawBoard.isMouseDown = true;
        //        $drawBoard.iLastX = e.clientX - $drawBoard.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft);
        //        $drawBoard.iLastY = e.clientY - $drawBoard.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop);
        var x = $drawBoard.iLastX = e.layerX || e.offsetX || (e.clientX - $drawBoard.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft));
        var y = $drawBoard.iLastY = e.layerY || e.offsetY || (e.clientY - $drawBoard.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop));
        pPoints.push({
            x: x,
            y: y
        });
    };
    var pPoints = [];
    var pMouseUp = function(e) {
        $drawBoard.isMouseDown = false;
        $drawBoard.iLastX = -1;
        $drawBoard.iLastY = -1;
        if (!e.isFromControl) {
            $B.fire('paint points', pPoints);
        }
        pPoints.length = 0;
    };
    $B.on('from control paint points', function(data) {
        // console.log(data);
        var points = data.points;
        //远程来的屏幕
        var wh = data.screen;
        var tOX = wh.width / 2,
            tOY = wh.height / 2;

        var width = $body.offsetWidth;
        var height = $body.offsetHeight;
        var cOX = width / 2,
            cOY = height / 2;

        var iw = width / wh.width;
        var ih = height / wh.height;

        var context = $drawBoard.context;
        context.beginPath();
        var startX = cOX - (tOX - points[0].x) * iw;
        var startY = cOY - (tOY - points[0].y) * ih;
        // console.log(startX, points[0].x, startY, iw, wh);
        context.moveTo(startX, startY);
        for (var i = 0, len = points.length; i < len; i++) {
            context.lineTo(cOX - (tOX - points[i].x) * iw, cOY - (tOY - points[i].y) * ih);
        }
        context.stroke();
    });
    var pMouseMove = function(e) {
        if ($drawBoard.isMouseDown) {
            //            var iX = e.clientX - $drawBoard.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft);
            //            var iY = e.clientY - $drawBoard.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop);
            var iX = e.layerX || e.offsetX || (e.clientX - $drawBoard.offsetLeft + ($win.pageXOffset || $doc.body.scrollLeft || $doc.documentElement.scrollLeft));
            var iY = e.layerY || e.offsetY || (e.clientY - $drawBoard.offsetTop + ($win.pageYOffset || $doc.body.scrollTop || $doc.documentElement.scrollTop));
            var context = $drawBoard.context;
            context.beginPath();
            context.moveTo($drawBoard.iLastX, $drawBoard.iLastY);
            context.lineTo(iX, iY);
            context.stroke();
            $drawBoard.iLastX = iX;
            $drawBoard.iLastY = iY;
            pPoints.push({
                x: iX,
                y: iY
            });
            e.preventDefault();
        }
    };
    //代理函数，用于函数控制

    function proxyFn(fnName, args) {
        $win[fnName](args);
    }

    /**
     * 默认配置
     * @type {Object}
     */
    var defaultOptions = {
        containerID: 'container',
        isControlDevice: false,
        drawBoardID: 'drawBoard',
        slideClass: '.slide',
        buildClass: '.build',
        progressID: 'progress',
        transition: '',
        tipID: 'tip',
        webSocketHost: '',
        width: 900,
        dir: './',
        height: 700,
        control: false
    };

    //初始化变量

    function initVar() {

        $slideTip = $$(defaultOptions.tipID);
        $container = $$(defaultOptions.containerID);
        slideWidth = defaultOptions.width;
        slideHeight = defaultOptions.height;
        $progress = $$(defaultOptions.progressID);
        Slide.$slides = $slides = toArray($(defaultOptions.slideClass, $container));



        slideCount = $slides.length; //幻灯片总页数-1
        Slide.count = slideCount;

        // $container.style.width = slideCount*slideWidth + 'px';//设置容器总宽度
        slideCount--;
        $drawBoard = $$(defaultOptions.drawBoardID);
        if ($drawBoard) {
            $drawBoard.style.display = 'none';
        }
    }

    function fullImg() {

            loadJS(defaultOptions.dir + 'img.screenfull.js', function() {
                //图片处理
                var $imgs = toArray($(defaultOptions.slideClass + ' img', $container));
                screenfull($imgs);
            });
        }
        //初始化

    function init(options) {
        options = options || {};

        for (var key in defaultOptions) {
            if (!!(key in options)) {
                defaultOptions[key] = options[key];
            }
        }
        Slide.dir = defaultOptions.dir;
        if (defaultOptions.control) {
            var control = defaultOptions.control;
            loadJS(defaultOptions.dir + 'nodeppt.control.js', function() {
                Slide.Control.load(control.type, control.args);
            });
        }


        initVar(); //初始化变量
        makeBuildLists();
        fullImg(); //图片全屏
        bindEvent();
        pastIndex = curIndex;
        if (location.hash && (curIndex = (location.hash.substr(1) | 0))) {
            doSlide();
        } else {
            updateSlideClass();
            setProgress();
            slideInCallBack();
        }
        preload($slides[curIndex])($slides[curIndex + 1]);
        $body.style.opacity = 1;
    }
    var Slide = {
        init: init,
        next: nextSlide,
        prev: prevSlide,
        doSlide: doSlide,
        proxyFn: proxyFn,
        showPaint: showPaint,
        removePaint: removePaint
    };
    ['on', 'un', 'fire'].forEach(function(v) {
        Slide[v] = function() {
            var args = toArray(arguments);
            args[0] = 'slide.' + args[0];
            $B[v].apply(null, args);
        }
    });

    $win.Slide = Slide;

}(window, document, MixJS.event.broadcast, MixJS.loadJS, MixJS.loadCSS));
