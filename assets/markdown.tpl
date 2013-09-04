<!--
    Powered By nodePPT
    version: <%= nodeppt_version %>
    site: <%= nodeppt_site %> 
    date: <%= grunt.template.today('yyyy-mm-dd') %>
-->
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title><%= title %> - By <%= speaker %></title>
    <link rel="stylesheet" media="all" href="/css/nodeppt.css">
    <link rel="stylesheet" media="only screen and (max-device-width: 480px)" href="/css/phone.css">
</head>
<body>

<slides id="container" class="layout-widescreen">
    <slide class="slide ">
      <article class="flexbox vcenter">
          <h1><%= title %></h1>
          <h3><a href="<%= url %>" target="_blank"><%= speaker %></a></h3>
      </article>
    </slide>
    <%= content %>
    <slide class="slide thank-you-slide segue nobackground">
        <article class="flexbox vleft auto-fadein">
            <h2>&lt;Thank You!&gt;</h2>
        </article>
    </slide>    
    <div class="slideTip" id="tip"></div>
    <canvas id="drawBoard" class="draw-board" width="900" height="700"></canvas>
</slides>
<div class="progress"><span id="progress"></span></div>
<script src="/js/mixjs/lib/mix.0.3.0.min.js"></script>
<script>
var base = location.protocol + '//' + location.host + '/';
MixJS.config({
    baseURL:base + 'js/'
});
MixJS.use('event/broadcast', function($){
    $.loadJS('/js/nodeppt.js',function(){
        Slide.init({
            containerID: 'container',
            drawBoardID: 'drawBoard',
            slideClass: '.slide',
            buildClass: '.build',
            progressID: 'progress',
            transition: '<%= transition %>',
            tipID: 'tip',
            width: 1100,
            dir: '/js/',
            control:{
                type: 'socket',
                args:{
                    isControl: location.hash.slice(1,8) === 'control',
                    host: base,
                    //摇一摇
                    shake: true
                }
            }
            //打开下面的注释就开启postMessage方式
            //访问网址127.0.0.1:8080/ppt/demo#client
            // control:{
            //     type: 'postMessage'
            // }
        });
    }).loadJS('/js/prettify.js',function(){
        var codes = document.querySelectorAll('code');
        for(var i=0,len = codes.length;i<len;i++){
            codes[i].classList.add('prettyprint');
        }
        prettyPrint();
    });
});
</script>
    
</body>
</html>