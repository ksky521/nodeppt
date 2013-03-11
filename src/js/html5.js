/**
 * @author theowang
 */
function byId(id){
	return document.getElementById(id);
}

//slide cover

var smokeTimer;
function smokeAnimate(){
    clearSmokeAnimate();
    var self = arguments.callee;
    smokeTimer = setTimeout(function(){
        var old = byId('smokeAnimate');
        var clone = old.cloneNode(true),$p = old.parentNode;
        $p.appendChild(clone);
        old.parentNode.removeChild(old);
        self();
    },3E3);
}
function clearSmokeAnimate(){
	smokeTimer && clearTimeout(smokeTimer);
}

//player
function loadPlayer(){
    byId('playerIframe').src = 'http://4.qdemo.sinaapp.com/html5/audio/player.html';
}
function clearPlayer(){
    byId('playerIframe').src = 'about:blank';
}
//canvas clock

var clockTimer;
function showClock(){
    clock();  
    clearClock();
    clockTimer = setInterval(clock,1e3);  
}
function clearClock(){
    clockTimer && clearInterval(clockTimer);
}
function clock(){  
  var now = new Date();  
  var ctx = byId('canvasDemoClock').getContext('2d');  
  ctx.save();  
  ctx.clearRect(0,0,150,150);  
  ctx.translate(75,75);  
  ctx.scale(0.4,0.4);  
  ctx.rotate(-Math.PI/2);  
  ctx.strokeStyle = "black";  
  ctx.fillStyle = "white";  
  ctx.lineWidth = 8;  
  ctx.lineCap = "round";  
  
  // Hour marks  
  ctx.save();  
  for (var i=0;i<12;i++){  
    ctx.beginPath();  
    ctx.rotate(Math.PI/6);  
    ctx.moveTo(100,0);  
    ctx.lineTo(120,0);  
    ctx.stroke();  
  }  
  ctx.restore();  
  
  // Minute marks  
  ctx.save();  
  ctx.lineWidth = 5;  
  for (i=0;i<60;i++){  
    if (i%5!=0) {  
      ctx.beginPath();  
      ctx.moveTo(117,0);  
      ctx.lineTo(120,0);  
      ctx.stroke();  
    }  
    ctx.rotate(Math.PI/30);  
  }  
  ctx.restore();  
    
  var sec = now.getSeconds();  
  var min = now.getMinutes();  
  var hr  = now.getHours();  
  hr = hr>=12 ? hr-12 : hr;  
  
  ctx.fillStyle = "black";  
  
  // write Hours  
  ctx.save();  
  ctx.rotate( hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec )  
  ctx.lineWidth = 14;  
  ctx.beginPath();  
  ctx.moveTo(-20,0);  
  ctx.lineTo(80,0);  
  ctx.stroke();  
  ctx.restore();  
  
  // write Minutes  
  ctx.save();  
  ctx.rotate( (Math.PI/30)*min + (Math.PI/1800)*sec )  
  ctx.lineWidth = 10;  
  ctx.beginPath();  
  ctx.moveTo(-28,0);  
  ctx.lineTo(112,0);  
  ctx.stroke();  
  ctx.restore();  
    
  // Write seconds  
  ctx.save();  
  ctx.rotate(sec * Math.PI/30);  
  ctx.strokeStyle = "#D40000";  
  ctx.fillStyle = "#D40000";  
  ctx.lineWidth = 6;  
  ctx.beginPath();  
  ctx.moveTo(-30,0);  
  ctx.lineTo(83,0);  
  ctx.stroke();  
  ctx.beginPath();  
  ctx.arc(0,0,10,0,Math.PI*2,true);  
  ctx.fill();  
  ctx.beginPath();  
  ctx.arc(95,0,10,0,Math.PI*2,true);  
  ctx.stroke();  
  ctx.fillStyle = "#555";  
  ctx.arc(0,0,3,0,Math.PI*2,true);  
  ctx.fill();  
  ctx.restore();  
  
  ctx.beginPath();  
  ctx.lineWidth = 14;  
  ctx.strokeStyle = '#325FA2';  
  ctx.arc(0,0,142,0,Math.PI*2,true);  
  ctx.stroke();  
  
  ctx.restore();  
}
//webgl
function loadWebGL(){
    byId('webglIframe').src = 'http://slides.html5rocks.com/src/webgl/san_angeles.html';
}
function clearWebGL(){
    byId('webglIframe').src = 'about:blank';
}
///dancer
function loadDancer(){
    byId('dancerIframe').src = 'http://4.qdemo.sinaapp.com/dancer/index2.html';
}
function clearDancer(){
    byId('dancerIframe').src = 'about:blank';
}

//notice
function notificationsPer(){
    window.webkitNotifications.requestPermission();
}
function showNotice(val){
    if (window.webkitNotifications.checkPermission() == 0) {
        var body = val || byId('noticeBody').value;
        
        var n = window.webkitNotifications.createNotification('http://tp4.sinaimg.cn/2037334587/50/5626160002/1','通知title','通知body：'+body);
        n.show(); // note the show()
        setTimeout(function(){
            n.cancel()
        },5e3);
        
    } else {
        alert("This page doesn't have permission to show notifications yet.");
    }
}
function showNotifications() {
    if (window.webkitNotifications.checkPermission() == 0) {
        // you can pass any url as a parameter
        var n = window.webkitNotifications.createNotification('http://tp4.sinaimg.cn/2037334587/50/5626160002/1','通知title','通知body：'+
        '妈妈说内容可以不多，但是一定要长！妈妈说内容可以不多，但是一定要长！妈妈说内容可以不多，但是一定要长！妈妈说内容可以不多，但是一定要长！');
        n.show(); // note the show()
        setTimeout(function(){
            n.cancel()
        },3e3);
    } else {
        alert("This page doesn't have permission to show notifications yet.");
    }
}
//drag drop
;!function(){
if (window.FileReader) {
    var list = byId('fileUl'), cnt = byId('fileContainer');
    // 判断是否图片
    function isImage(type) {
        switch (type) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
            case 'image/bmp':
            case 'image/jpg':
                return true;
            default:
                return false;
        }
    }
    // 处理拖放文件列表
    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        for (var i = 0, f; f = files[i]; i++) {
            var t = f.type ? f.type : 'n/a', reader = new FileReader(), looks = function(f, img) {
                list.innerHTML += '<li><strong>' + f.name + '</strong> (' + t +
                ') - ' +
                f.size +
                ' bytes<p>' +
                img +
                '</p></li>';
                cnt.innerHTML += img;
            }, isImg = isImage(t), img;
            // 处理得到的图片
            if (isImg) {
                reader.onload = (function(theFile) {
                    return function(e) {
                        img = '<img class="preview" src="' + e.target.result + '" title="' + theFile.name + '"/>';
                        looks(theFile, img);
                    };
                })(f)
                reader.readAsDataURL(f);
            } else {
                img = '"o((>ω< ))o"，你传进来的不是图片！！';
                looks(f, img);
            }
        }
        this.setAttribute('style', '');
    }
    // 处理插入拖出效果
    function handleDragEnter(evt) {
        this.setAttribute('style', 'border-style:dashed;');
    }
    function handleDragLeave(evt) {
        this.setAttribute('style', '');
    }
    // 处理文件拖入事件，防止浏览器默认事件带来的重定向
    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }
    cnt.addEventListener('dragenter', handleDragEnter, false);
    cnt.addEventListener('dragover', handleDragOver, false);
    cnt.addEventListener('drop', handleFileSelect, false);
    cnt.addEventListener('dragleave', handleDragLeave, false);
} else {
    byId('fileContainer').innerHTML = '你的浏览器不支持啊，同学';
}
}();

//baidu map
var baiduMap;
function loadMap(){
    baiduMap = new BMap.Map("geoMap");
    baiduMap.centerAndZoom("北京", 15);
}
function geoLocation(){
    if (navigator.geolocation) {
        var geo=navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var accuray = position.coords.accuracy;
            var pt = new BMap.Point(lng, lat);
            baiduMap.centerAndZoom(pt, 17);
            var myIcon = new BMap.Icon("http://dev.baidu.com/wiki/static/map/API/img/fox.gif", new BMap.Size(300, 157));
            var marker = new BMap.Marker(pt, {
                icon: myIcon
            }); // 创建标注
            var str = '<br/>定位精度为：' + accuray;
            if (accuray > 3e3) {
                str += '<br/><span class="red">精度有点差%>_<%，请使用wifi来试试</span>';
            }
            baiduMap.addOverlay(marker); // 将标注添加到地图中
            //让小狐狸说话（创建信息窗口）
            var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;line-height:1.2em;'>您所在的位置：纬度" + lat + "，经度" + lng + str + "</p>");
            marker.addEventListener("click", function() {
                this.openInfoWindow(infoWindow);
            });
            marker.openInfoWindow(infoWindow);
        }, function(){
            alert('定位失败=>_<=');
        }, {
            enableHighAccuracy: true,
            maximumAge: 3E4,
            timeout: 2.7E3
        });
    }else{
        alert('浏览器不支持 geolocation');
    }
}
//camera
;!function(){
    navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    var hasGetUserMedia = function() {
        return !!navigator.getUserMedia_;
    }();
    var video = byId('camera');
    var canvas = byId('cameraPhoto');
    
    function openCamera() {
		if (hasGetUserMedia) {
			try {
				navigator.getUserMedia_({
					video: !0,
					audio: !1
				}, gotStream, noStream);
			} catch (j) {
				try {
					navigator.getUserMedia_("video", gotStream, noStream);
				} catch (j) {
					throw new Error(j);
				}
			}
		} else {
			alert('不支持web camera');
		}
		return false;
	}
	function snapshot() {
	    if (hasGetUserMedia) {
	        canvas.width = video.videoWidth;
	        canvas.height = video.videoHeight;
	        canvas.getContext('2d').drawImage(video, 0, 0);
	    } else {
	        alert('No native camera support available.');
	    }
	}
    
    function gotStream(stream) {
        var url = window.URL || window.webkitURL;
        video.src = url.createObjectURL(stream);
        video.onerror = function() {
            stream.stop();
            streamError();
        };
    }
    
    function noStream() {
        alert('No camera available.');
    }
    
    function streamError() {
        alert('Camera error.');
    }
    function stopCamera(){
		video.stop();
	}
    window.openCamera = openCamera;
	window.stopCamera = stopCamera;
    window.snapshot = snapshot;
}();




//rgbaRange
byId('rgbaRange').addEventListener('change',function(){
    var val = parseFloat(this.value).toFixed(1);
    byId('rgbaRangeVal').innerHTML = val;
    byId('rgbaBox').style.background = 'rgba(255,0,0,'+val+')';
},true);
//rangeHandle
function rangeHandle(bindId, cssId, cId){
    byId(bindId).addEventListener('change', function(){
        var val = this.value;
        byId(cssId).innerHTML = val;
        byId(cId).style.borderRadius = val + 'px';
    }, true);
}
rangeHandle('radiusRange','radiusRangeVal','radiusBox');
//aniclass
function aniClass(cls){
    var node = byId('animateTest');
    node.className = '';
    node.classList.add(cls);
}