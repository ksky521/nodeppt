# nodePPT — nodejs做的手机端控制PC端的PPT演示文档javascript框架
[nodePPT](https://github.com/ksky521/nodePPT)使用nodejs写的，可以手机端控制pc端的演示文档框架。nodePPT是在[webSlide](https://github.com/ksky521/webSlide)基础上二次开发的，使用nodejs做服务器，通过websocket来实现手机端和PC的通信，主要功能是手机端可以控制pc端PPT播放进度，并且手机端可以给每张PPT做备注。

第一次做个程序的nodejs作品，并且测试时间比较短，肯定会有很多问题和bug，希望大家一起斧正。另外页面样式css高手可以自己写，包括动画自定义都可以在css文件中直接修改添加。

## 说明

因为是PPT演示文档，所以需要投影仪分辨率，所以演示页面的最佳分辨率为全屏模式下的 ``1024*768`` ，如果在自己电脑上查看，可以通过 ``ctrl + -`` 和 ``ctrl + +`` 缩放到合适的比例查看效果。

建议浏览器chrome 16+，全屏模式（F11），以达到最佳动画效果。在Firefox下会出现拖尾现象，个人认为是Firefox 8下对CSS3动画效果渲染太慢导致，其他浏览器未测试。

#### 使用说明
> * 1、配置route.json
> * 2、配置ppt的文件
> * 3、启动node：node server.js
> * 4、PC访问：如127.0.0.1:3000/demo.ppt
> * 5、手机端访问：127.0.0.1:3000/ctrl
> * 6、手机端setup，选择控制用户后，开始控制

具体使用方法启动node server.js之后访问127.0.0.1:3000/index.ppt，里面有详细的介绍

## 快捷键

* 空格/→/↓/Tab/pageDown：下一页
* ←/↑/pageUp：上一页
* P：开画板
* C：清除画板

## 版本库地址

支持三种访问协议：

* HTTP协议： `https://ksky521@github.com/ksky521/nodePPT.git` 。
* Git协议： `git://github.com/ksky521/nodePPT.git` 。
* SSH协议： `ssh://git@github.com:ksky521/nodePPT.git` 。

## 克隆版本库

操作示例：

    $ git clone git://github.com/ksky521/nodePPT.git
	
## 联系方式

作者博客：[js8.in](http://js8.in)

作者新浪微博：[@三水清](http://weibo.com/sanshuiqing)
