nodePPT - 让你爱上做分享！
=============
[This is a readme file in English](./README_EN.md)

[![NPM](https://nodei.co/npm-dl/nodeppt.png)](https://nodei.co/npm/nodeppt/)
[![NPM](https://nodei.co/npm/nodeppt.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nodeppt/)

## 为什么选择nodePPT

**这可能是迄今为止最好的网页版PPT**

 * 基于GFM的markdown语法编写
 * 支持[html混排](#mixed-code)，再复杂的demo也可以做！
 * [导出网页](#export-html)或者[pdf](#export-pdf)更容易分享
 * 支持[20种转场动画](#transition)，可以设置单页动画
 * 支持单页背景图片
 * 多种模式：overview模式，[双屏模式](#postmessage)，[socket远程控制](#socket)，摇一摇换页，使用ipad/iphone控制翻页更酷哦~
 * 可以使用画板，**双屏同步画板**内容！可以使用note做备注
 * 支持语法高亮，自由选择[highlight样式](https://highlightjs.org/)
 * 可以单页ppt内部动画，单步动画
 * [支持进入/退出回调](#callback)，做在线demo很方便
 * 支持事件update函数，查看[demo](http://qdemo.sinaapp.com/#12)

## 1.0.0新功能
 * 实现watch功能`nodeppt start -w`

## 0.9.0 新功能
 * 添加画板多端同步
 * 添加按钮控制进度
 * 新增两种转场动效，增加事件绑定方法：`Slide.on`
 * 修复一些bug

## demo
 * http://qdemo.sinaapp.com/
 * 双屏控制：http://qdemo.sinaapp.com/?_multiscreen=1 记得允许弹窗哦~
 * 手机百度前端之路：http://qdemo.sinaapp.com/box-fe-road.htm

## theme 自定义
感觉默认的模板不符合新意？可以支持自定义模板，查看[theme.moon](https://github.com/ksky521/nodePPT/blob/master/assets/scss/theme.moon.scss)

自定义后的模板路径在markdown的设置里填写：

```markdown
title: 这是演讲的题目
speaker: 演讲者名字
url: 可以设置链接
transition: 转场效果，例如：zoomin/cards/slide
files: /css/theme.moon.css
```

## 安装

```bash
npm install -g nodeppt
```

## shell使用

### 启动

```bash
# 获取帮助
nodeppt start -h
# 绑定端口
nodeppt start -p <port>
```

```bash
nodeppt start -p 8090 -d path/for/ppts
# 绑定host，默认绑定0.0.0.0
nodeppt start -p 8080 -d path/for/ppts -H 127.0.0.1
# 使用socket通信（按Q键显示/关闭二维码，手机扫描，即可控制）
# socket须知：1、注意手机和pc要可以相互访问，2、防火墙，3、ip
```

#### 启用socket控制

##### 方法一：使用url参数

```bash
http://127.0.0.1:8080/md/demo.md?controller=socket
```

在页面按键【Q】显示控制url的二维码和控制链接（需要隐身窗口打开），手机上可以使用左右touch滑动和摇一摇切换下一页

##### 方法二：使用`start`命令行

```bash
nodeppt start -c socket
```
在页面按键【Q】显示控制url的二维码和控制链接（需要隐身窗口打开），手机上可以使用左右touch滑动和摇一摇切换下一页

#### 启用postMessage控制
默认使用postMessage多窗口控制，打开方法：

```bash
http://127.0.0.1:8080/md/demo.md?_multiscreen=1
```

### 事件绑定
使用函数`Slide.on`，目前支持update函数，即转场后的回调。示例代码：

```javascript
Slide.on('update', function(i, itemIndex, cls) {
//接受三个参数：
//* 当前slide的index
//* itemIndex当前slide进入的第几个build动画，从1开始
//* 方向pageup/pagedown
    Puff.add('#FFC524' /*colors[i % 6]*/ , ctx, 20, 700, width / 2, height / 2, width / 1.8, 400);
    clearInterval(timer);
    //第十三个有动效
    if (i === 13 || i === 14) {
        timer = setInterval(function() {
            Puff.draw(1);
        }, 1E3 / FPS);
    }

})
```
demo中[第13张](http://qdemo.sinaapp.com/#13)使用回调做了魔幻翻页效果

### 导出ppt
这么高端大气上档次的ppt，怎么能不导出分享给大家呢？？

导出ppt有三种，一种最简单直接**ctrl+P（推荐此方法另存为pdf）**，一种是**pdf版**，一种是**html版**

<a name="export-pdf"></a>
#### pdf版（不推荐，原因phantomjs的webkit版本低）
需要安装[phantomJS](http://phantomjs.org/)。

```bash
# 安装phantomjs，如果安装了，请忽略
npm install -g phantomjs
# 启动nodeppt server
nodeppt start
# 导出文件
nodeppt pdf http://127.0.0.1:8080/md/demo.md a.pdf
```

phantomjs版本可能较老，推荐在chrome浏览器中使用`ctrl+P`选择另存为pdf

<a name="export-html"></a>
#### html版

```bash
# 获取generate帮助
nodeppt generate -h
# 使用generate命令
nodeppt generate filepath
# 导出全部，包括nodeppt的js、img和css文件夹
# 默认导出在publish文件夹
nodeppt generate ./ppts/demo.md -a
# 指定导出文件夹
nodeppt generate ./ppts/demo.md -a -o output/path
```
导出目录下所有ppt，并且生成ppt list首页：

```bash
nodeppt path -o output/path -a
```


```

#### markdown语法
nodeppt是支持**marked**语法的，但是为了制作出来更加完美的ppt，扩展了下面的语法

#### 配置
基本配置如下：
```markdown
title: 这是演讲的题目
speaker: 演讲者名字
url: 可以设置链接
transition: 转场效果，例如：zoomin/cards/slide
files: 引入js和css的地址，如果有的话~自动放在页面底部
```
**目录关系**：可以在md同级目录下创建img、js、css等文件夹，然后在markdown里面引用，nodeppt默认会先查找md文件同级目录下面的静态资源，没有再找默认的```assets```文件夹下静态内容

<a name="transition"></a>
支持的转场动画包括：

 * kontext
 * vkontext
 * circle
 * cover-circle
 * cover-diamond
 * earthquake
 * cards
 * glue
 * stick
 * move
 * newspaper
 * slide
 * slide2
 * slide3
 * horizontal3d
 * horizontal
 * vertical3d
 * zoomin
 * zoomout
 * pulse


如果设置单页动画，请参考下面的**[单页动画设置](#transition-page)**部分~

#### 分页
通过```[slide]```作为每页ppt的间隔，如果需要添加单页背景，使用下面的语法：

```markdown
[slide style="background-image:url('/img/bg1.png')"]
# 这是个有背景的家伙
## 我是副标题
```

#### 单页ppt上下布局
```markdown
[slide]
## 主页面样式
### ----是上下分界线
----
nodeppt是基于nodejs写的支持 **Markdown!** 语法的网页PPT

nodeppt：https://github.com/ksky521/nodePPT
```

#### 代码格式化
语法跟**Github Flavored Markdown** 一样~


<a name="transition-page"></a>
#### 单页动画设置
在md文件，顶部 ```配置``` 可以设置全局转场动画，如果要设置单页的转场动画，可以通过下面的语法

```markdown
[slide data-transition="vertical3d"]
## 这是一个vertical3d的动画
```

<a name="mixed-code"></a>
#### 插入html代码
如果需要完全diy自己的ppt内容，可以**直接使用** html标签，支持markdown和html混编。例如：

```markdown
<div class="file-setting">
    <p>这是html</p>
</div>
<p id="css-demo">这是css样式</p>
<p>具体看下项目中 ppts/demo.md 代码</p>
<script>
    function testScriptTag(){

    }
    console.log(typeof testScriptTag);
</script>
<style>
#css-demo{
    color: red;
}
</style>
```

<a name="callback"></a>
#### 转场回调
前端的ppt，难免会在页面中演示一些demo，除了上面的插入html语法外，还提供了```incallback```和```outcallback```，分别用于：切入（切走）到当前ppt，执行的js函数名。例如：

```markdown
[slide data-outcallback="outcallback" data-incallback="incallback"]
## 当进入此页，就执行incallback函数
## 当离开此页面，就执行outcallback函数
```

#### 表格实例
```markodwn
### 市面上主要的css预处理器：less\sass\stylus
---
 |less| sass | stylus
:-------|:------:|-------:|--------
环境 |js/nodejs | Ruby | nodejs
扩展名 | .less | .sass/.scss | .styl
特点 | 老牌，用户多，支持js解析 | 功能全，有成型框架，发展快 | 语法多样，小众
案例/框架 | [Bootstrap](http://getbootstrap.com/) | [compass](http://compass-style.org) [bourbon](http://bourbon.io) |
```

#### 插入iframe
使用```data-src```作为iframe的url，这样只有切换到当前页才会加载url内容~
```markdown
<iframe data-src="http://www.baidu.com" src="about:blank;"></iframe>
```


#### 示例
类似下面的语法：(更多用法查看ppts/demo.md文件)
```markdown
title: nodeppt markdown 演示
speaker: Theo Wang
url: https://github.com/ksky521/nodePPT
transition: zoomin

[slide]

# 封面样式
## h1是作为封面用的，内部的都用h2

[slide style="background-image:url('/img/bg1.png')"]

# 背景图片 {:&.flexbox.vleft}
## 使用方法：&#91;slide style="background-image:url('/img/bg1.png')"&#93;

[slide]

## 主页面样式
### ----是上下分界线
----

nodeppt是基于nodejs写的支持 **Markdown!** 语法的网页PPT

nodeppt：https://github.com/ksky521/nodePPT

[slide]

什么？这些功能还不够用？

极客模式：查看源码的nodeppt.js，相信你会找到牛逼的手机互动（摇一摇换页）功能

查看项目目录ppts获取更多帮助信息
```

更多demo，查看 ```ppts``` 目录的demo

### 查看帮助

```bash
nodeppt -h
# 任何命令都可以输入-h查看帮助
nodeppt start -h
```

## demo演示 & 使用方法

 * 执行 ```nodeppt start```
 * 访问 [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
 * 在线demo： http://qdemo.sinaapp.com/


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/ksky521/nodeppt/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

## Thanks
* http://tympanus.net/Development/ItemTransitions/index2.html
* http://tympanus.net/Development/PageTransitions/
* https://github.com/daneden/animate.css






English version:


nodePPT - just enjoy presentation
==================================
## why nodePPT?

**Maybe the best PPT webapp ever**

 * markdown based on GFM;

 * mix-code with html and markdown

 * export your work with html and pdf format;

 * 18 different transition animations, and you can choose single page animation well;

 * Setting one page background image different than others;

 * overview mode, multiscreen mode, remote control with socket, shark to page-flipping with ipad/iphone;

 * canvas is also supported, with socket, we **sync your multiscreen in real time**, and you can type some notes;

 * syntax highlighting of course, and you may want to customize your [syntax highlighting style](https://highlightjs.org/), it's supported well;

 * Animation in single page, one-step animation;

 * [forward and backward callback function](#callback)

## 0.9.0 new features

 * real time sync canvas drawing across multiple device

 * add buttons to control page-flipping

 * bugs fixed

## demo

 * http://qdemo.sinaapp.com/

 * sync multiscreen in real time: http://qdemo.sinaapp.com/?_multiscreen=1 (make sure alert is allowed in your browser)

 * front-end experience of mobile baidu: http://qdemo.sinaapp.com/box-fe-road.htm


## customize your theme

 * default theme is not cool?  just customize your theme! take a look with [theme.moon](https://github.com/ksky521/nodePPT/blob/master/assets/scss/theme.moon.scss)

 * write your customize theme's template path in setting md:

 ```markdown
 title: presentation title
 speaker: author name
 url: http://your.site
 transition: zoomin/cards/slide/...
 files: /path/to/your/theme.css
 ```

## install

 ```bash
 # get help
 nodeppt start -h
 # bind given port
 nodeppt start -p <port>
```

```bash
nodeppt start -p 8090 -d path/for/ppts
# bind host, default value: (0.0.0.0)
nodeppt start -p 8080 -d path/for/ppts -H 127.0.0.1
# socket (type 'Q' to show/hide QR Code, use your phone scan it, and you can control the slider)
# if your want to use socket, notice the follow:
		* 1, make sure that your phone and your pc/mac is allowed to access to each other
		* 2, the firewall
		* 3, ip
```


#### how to start socket?

##### use 'start' command:

```bash
nodeppt start -c socket
```

type 'Q' in page to show the QR Code, scan it, and you can control the slider on your phone: swipe or touch or shake to page-flipping

##### or with url params

```bash
http://127.0.0.1:8080/md/demo.md?controller=socket
```

type 'Q' in page to show the QR Code, scan it, and you can control the slider on your phone: swipe or touch or shake to page-flipping



#### how to start postMessage:

```bash
http://127.0.0.1:8080/md/demo.md?_multiscreen=1
```

#### export your ppt

share your awesome slider with others, why not?

#### export to pdf format:
<a name="export-pdf"></a>
need to install phantomjs

```bash
npm install -g phantomjs
# start nodeppt server
nodeppt start
# export file
nodeppt pdf http://127.0.0.1:8080/md/demo.md -o a.pdf
```

<a name="export-html"></a>
#### export to html

```bash
# get generate help
nodeppt generate -h
# generate command
nodeppt generate filepath
# export all project file, include js, img, css folder
# export to publish folder default
nodeppt generate ./ppts/demo.md -a
# export to given folder
nodeppt generate ./ppts/demo.md -a -o output/path

export all ppt file and generate ppt list index:
```bash
nodeppt path -o output/path -a
```

#### markdown syntax
nodeppt supports **marked** syntax, but for greater ppt, we extend the next syntax:

#### settings
```markdown
title: presentation title
speaker: author name
url: http://your.site
transition: zoomin/cards/slide/...
files: path/to/js/or/css/files
```

**directory relationship**:

<a name="transition"></a>
support the followed animations:

 * kontext
 * vkontext
 * circle
 * earthquake
 * cards
 * glue
 * stick
 * move
 * newspaper
 * slide
 * slide2
 * slide3
 * horizontal3d
 * horizontal
 * vertical3d
 * zoomin
 * zoomout
 * pulse

if you want set single page animation, go to **[single page animation setting](#transition-page)**


```markdown
[slide style="background-image:url('/img/bg1.png')"]
# slide with background image
## I'm subtitle
```

#### single page ppt top-down layout
```markdown
[slide]
## home page stylesheet
### ---- boundary
----
nodeppt is a ppt webapp coded by nodejs
nodeppt: https://github.com/ksky521/nodePPT

#### code formatting
the same as **Github Flavored Markdown**

<a name="transition-page"></a>
#### single page animation
on the top of the md file, you can set global transition animation in ```setting```, if want to set single page transition animation, use the followed syntax:

```markdown
[slide data-transition="vertical3d"]
## this is a vertical3d transition animation
```

<a name="mixed-code"></a>
#### insert html code
If want to diy your ppt total, you can **directly** use html tag. As you see, mixed-code with html and markdown is supported well.
For example:
```markdown
<div class="file-setting">
    <p>this is html</p>
</div>
<p id="css-demo">css style</p>
<p>for more details, visit ppts/demo.md</p>
<script>
    function testScriptTag(){

    }
    console.log(typeof testScriptTag);
</script>
<style>
#css-demo{
    color: red;
}
</style>
```

<a name="callback"></a>
#### transition callback
you can use ```incallback```和```outcallback``` to define your callback function while the page forward and backward.
suck like this:
```markdown
[slide data-outcallback="outcallback" data-incallback="incallback"]
## when get into this page, call incallback function
## when left this page, call outcallback function
```

#### table example
```markodwn
### css preprocessor：less\sass\stylus
---
|less| sass | stylus
:-------|:------:|-------:|--------
environment |js/nodejs | Ruby | nodejs
.ext | .less | .sass/.scss | .styl


#### insert iframe
use ```data-src``` as the url of the iframe, the iframe will not load the content untill the page be displayed.
```markdown
<iframe data-src="http://www.baidu.com" src="about:blank;"></iframe>
```

#### example
for more go to ppts/demo.md
```markdown
title: nodeppt markdown presentation
speaker: Theo Wang
url: https://github.com/ksky521/nodePPT
transition: zoomin

[slide]

# cover style
## h1 for cover, h2 for others

[slide style="background-image:url('/img/bg1.png')"]

# background iamge {:&.flexbox.vleft}
## &#91;slide style="background-image:url('/img/bg1.png')"&#93;

[slide]

## home page style
### ---- boundary
----

nodeppt is a ppt webapp coded by nodejs

nodeppt: https://github.com/ksky521/nodePPT


[slide]

what? want more features?

geek mode: check the source code, find nodeppt.js, and you'll find the awesome "shake to page-flipping".

check the project directory for more infomation
```

To see more demo, check the ```ppts``` folder

### help

```bash
nodeppt -h
# type -h after any command to see the help.
nodeppt start -h
```

## how to run the demo?

 * run ```nodeppt start```
 * visit [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
 * online demo： http://qdemo.sinaapp.com/


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/ksky521/nodeppt/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

## Thanks
* http://tympanus.net/Development/ItemTransitions/index2.html
* http://tympanus.net/Development/PageTransitions/
* https://github.com/daneden/animate.css


