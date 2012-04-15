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
			content:'<h2>神马是nodePPT</h2>'+
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
					 '<li>基于 webSlide</li>'+
					 '<li>手机端 jquery moblie</li></ul>'
		},
		{
			title:'怎样使用',
			remark:'安装nodejs',
			content:'<span class="titleTip">怎么使用nodePPT</span>'+
			         '<section style="padding:80px 50px;">'+
					 '<h3>测试内容</h3>'+
					 '<p>测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容</p>'+
					 '</section>'
		},
		{
            title:'怎样使用',
            remark:'安装nodejs',
            content:'<span class="sj">怎么使用nodePPT</span>'
        },
		{
            title:'斜角',
            remark:'斜角演示',
            content:'<div class="transform">怎么使用nodePPT</div>'+
			         '<pre>'+
				'<code class="javascript">var a = b;\n'+
				'function abc(){\n'+
				'    //do something\n'+
				'    return str;\n'+
				'}\n'+
				'</code></pre>'
        },
		{
            title:'Thanks',
            remark:'感谢',
            content:'<section class="title">'+
                        '<h1 class="slideTitle">Q & A</h1>'+
                        '<h3>Thanks</h3>'+
                    '</section>'
        },
	]
};