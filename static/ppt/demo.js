var slideData = {
    title:'nodePPT简介',
	config:{
	  slideId:'slide',
	  canvasId:'myCanvas',
	  ctrlId:'slideCtrl',
	  remoteControl:true
	},
	slides:[
		{
			title:'封面',
			id:'cover',
			animate:'zoomout',
			content:'<section class="title">'+
                        '<h1 class="slideTitle">nodePPT简介</h1>'+
                        '<h3><a href="//weibo.com/sanshuiqing" target="_blank">@ 三水清</a></h3>'+
                        '<h3>博客：<a href="//js8.in" target="_blank">JS8.IN</a></h3>'+
                    '</section>'
		},
		{
			title:'神马是nodePPT',
			animate:'zoomin',
			remark:'基于webSlide，再次基础上添加nodejs支持，作为远程控制',
			content:'<span class="transformRight">神马是nodePPT</span>'+
			         '<h3>功能</h3>'+
			         '<ul><li>网页版的幻灯片</li>'+
					 '<li>支持远程播放控制</li>'+
					 '<li>支持手持设备控制</li>'+
					 '<li>分离功能和表现层，简化幻灯片开发</li></ul>'+
					 '<!--pause-->'+
					 '<h3>开发用到的技术</h3>'+
			         '<ul><li>结构 html5</li>'+
					 '<li>动画 css3</li>'+
					 '<li>后端 nodeJS</li>'+
					 '<li>通信 websocket</li>'+
					 '<li>手机端 jquery moblie</li></ul>'
		},
		{
			title:'配置nodeJS',
			remark:'配置nodejs',
			content:'<span class="titleTip">配置nodeJS</span>'+
			         '<section style="padding:80px 50px;">'+
					 '<h3>安装nodeJS模块</h3>'+
					 '<pre><code class="bash">npm express connect socket.io jade</code></pre>'+
					 '<h3>配置router.json</h3>'+
                     '<pre><code class="json">{\n'+
					    '  "/test.ppt(名字)": {\n'+
					    '      "title":"PPT名字",\n'+
					    '      "dataJS":"PPT配置js文件",\n'+
					    '      "password": "访问密码"\n'+
					    '},\n//……\n}</code></pre>'+
					 '</section>'
		},
		{
            title:'配置data.js',
            remark:'配置dataJS',
            content:'<span class="sj">配置data.js</span>'+
                     '<section style="padding:120px 50px;">'+
                     '<pre><code class="javascript">'+
                            'var slideData = {\n'+
							'    title:\'PPT名字\',\n'+
							'    slides:[\n'+
							'        {\n'+
						    '             title: \'封面\', //用于远程显示\n'+
							'             remark: \'备注\', //用于远程显示\n'+
						    '             id: \'cover\', //id，location.hash\n'+
						    '             animate: \'zoomout\', //动画效果\n'+
						    '             content: \'页面HTML\' //页面内容\n'+
							'        },\n'+
							'//……\n'+
					'</code></pre>'+
					'</section>'
        },
		{
            title:'怎样使用',
            remark:'为什么设置密码：1、有些ppt是不外泄的；2、方便控制，如果任何人都可以访问控制端，那么pc端播放会受多人控制，这不是我们想要的',
			animate:'zoomin',
            content:'<div class="transform">启动node服务器</div>'+
			         '<section style="padding:120px 50px;">'+
					 '<pre><code class="bash">'+
					 'node server.js'+
					 '</code></pre>'+
					 '<h3>访问地址</h3>'+
					 '<ul>'+
                     '<li>控制端：http://127.0.0.1:3000/ctrl</li>'+
					 '<li>客户端：http://127.0.0.1:3000/demo.ppt</li>'+
                     '</ul>'+
					 '<p>pptid为客户端url，如填写demo.ppt，密码为route.json设置的密码</p>'+
                     '</section>'
        },
		
        {
            title:'手机控制端设置',
            animate:'zoomin',
            remark:'为什么需要先设置控制用户？如果多用户，我们需要选择多个用户一起控制他们',
            content:'<span class="transformRight">手机控制端设置</span>'+
                     '<section style="padding:80px"><h3>手机控制端</h3>'+
                     '<ul><li>用户访问ppt后，点击setup，选择控制的用户</li>'+
                     '<li>点击prev和next翻页</li>'+
                     '<li>点击列表的title直接翻页到当前页面</li>'+
                     '</ul>'+
					 '<p class="orange">注意：一定要先设置控制用户，才可以控制pc端哦~</p>'+
					 '</section>'
        },
		{
            title:'快捷键',
            animate:'zoomin',
            remark:'笔记本屏幕显示不全：使用ctrl++和ctrl+-来缩放或者F11来全屏，毕竟我们的ppt是做演示的，演示的时候一般都是全屏的，所以我把ppt做的比较大',
            content:'<span class="sj">客户端快捷键</span>'+
                     '<section style="padding:80px"><ul><li空格/→/↓/Tab/pageDown：下一页</li>'+
                     '<li>←/↑/pageUp：上一页</li>'+
                     '<li>P：开画板</li>'+
                     '<li>C：清除画板</li>'+
					 '<li>ctrl + -：缩小</li>'+
					 '<li>ctrl + +：放大</li>'+
					 '<li>F11：全屏模式</li>'+
					 '</ul></section>'
        },
		{
            title:'浏览器支持情况',
            animate:'zoomin',
            remark:'chrome17+，iOS5.01，iOS5.1',
            content:'<span class="sj">浏览器支持情况</span>'+
                     '<section style="padding:120px"><ul>'+
                     '<li>PC端：chrome17+，Firefox11+</li>'+
                     '<li>手机端：ios5.01和ios5.1</li>'+
                     '</ul>'+
					 '<p>其他浏览器没有测试，可能在动画和控制方面表现不佳</p>'+
					 '</section>'
        },
		{
            title:'演示截图',
            remark:'演示截图',
            content:'<div class="transform">手机控制端截图</div>'+
			    '<section style="padding:120px 50px;text-align: center;">'+
				'<img src="/img/demo.jpg" />'+
				'</section>'
        },
		{
            title:'Thanks',
            remark:'如果css3比较好的童鞋还可以自定义样式，修改css文件，实现更多的动画效果哦！~',
            content:'<section class="title">'+
                        '<h1 class="slideTitle">Q & A</h1>'+
                        '<h3>Thanks</h3>'+
                    '</section>'
        },
	]
};