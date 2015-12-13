nodePPT - 让你爱上做分享！
=============
[This is a readme file in English](./README_EN.md)

[![NPM](https://nodei.co/npm-dl/nodeppt.png)](https://nodei.co/npm/nodeppt/)
[![NPM](https://nodei.co/npm/nodeppt.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nodeppt/)

**导出pdf不再支持，请使用chrome打印服务另存为pdf，url中添加print=1，然后使用chrome打印 `ctrl+P` **

## 为什么选择nodePPT

**这可能是迄今为止最好的网页版演示库**

 * 基于GFM的markdown语法编写
 * 支持[html混排](#mixed-code)，再复杂的demo也可以做！
 * 支持多个皮肤：[colors](http://qdemo.sinaapp.com/?theme=colors)-[moon](http://qdemo.sinaapp.com/?theme=moon)-[blue](http://qdemo.sinaapp.com/?theme=blue)-[dark](http://qdemo.sinaapp.com/?theme=dark)-[green](http://qdemo.sinaapp.com/?theme=green)-[light](http://qdemo.sinaapp.com/?theme=light)
 * 实现watch功能`nodeppt start -w`
 * 支持[20种转场动画](#transition)，可以设置单页动画
 * 支持单页背景图片
 * 多种模式：overview模式，[双屏模式](#postmessage)，[socket远程控制](#socket)，摇一摇换页，使用ipad/iphone控制翻页更酷哦~
 * 可以使用画板，**双屏同步画板**内容！可以使用note做备注
 * 支持语法高亮，自由选择[highlight样式](https://highlightjs.org/)
 * 可以单页ppt内部动画，单步动画
 * [支持进入/退出回调](#callback)，做在线demo很方便
 * 支持事件update函数，查看[demo](http://qdemo.sinaapp.com/#12)
 * zoom.js：alt+click

## demo
 * http://qdemo.sinaapp.com/
 * 多套皮肤：[colors](http://qdemo.sinaapp.com/?theme=color)-[moon](http://qdemo.sinaapp.com/?theme=moon)-[blue](http://qdemo.sinaapp.com/?theme=blue)-[dark](http://qdemo.sinaapp.com/?theme=dark)-[green](http://qdemo.sinaapp.com/?theme=green)-[light](http://qdemo.sinaapp.com/?theme=light)
 * 双屏控制：http://qdemo.sinaapp.com/?_multiscreen=1 记得允许弹窗哦~
 * 三水清的分享：http://js8.in/slide
 * 打印页面：http://qdemo.sinaapp.com/?print=1

## 1.4 新功能
支持单个slide事件：build/enter/leave/keypress，事件统一在`[slide]`中使用`data-on-X`来指定一个*全局函数名*

### 事件说明如下
* build：当触发下一步操作的时候，会触发这个事件，具有stop方法
* keypress：在当前页面按键触发，具有stop方法
* enter/leave：进入/离开 此页面触发的事件，无stop方法

**build/keypress会在当前slide完全渲染后触发，回调函数会接受一个event对象，如果想阻止默认事件（即翻页，或者对应的快捷键），可以使用event对象的`stop()`方法；slide退场后事件解绑**

### 使用举例

#### 示例1：进入页面如果触发翻页事件，就会当前执行做转场，做一些类似magicmove效果
```markdown
[slide data-on-build="globalCallbackName"]
```

```javascript
var count = 0;
function globalCallbackName(e){
    count++;
    if(count<2){
        //做一些页面动效，或者转场
        e.stop();//阻止默认事件，就不会跳转
    }
}
```

#### 示例2：代理空格按键事件
```markdown
[slide data-on-keypress="globalCallbackName"]
```

```javascript
function globalCallbackName(e){
    if(e.keyCode==32){
        //play();//触发自定义的页面效果
        e.stop();//阻止默认事件，则不会触发nodeppt默认绑定的事件
    }
}
```



## 文件定位
对于nodeppt内部的文件，定位需要用根目录的方式来写，例如项目路径是 `slide`，`demo.md`中的图片使用：
```markdown
![测试文件路径](/img/demo.png)
```

对应的图片路径是 `slide/img/demo.png`

使用 `nodeppt generate demo.md output -a` 则生成后，图片路径是：`output/img/demo.png`


## magic

magic是在一页幻灯片中播放多个子页面，页面之间进行动效切换，但是slide不翻页（类似keynote的magicmove），使用`[magic]`标签包裹，子页面之间使用`====`间隔

`[magic]`标签支持全部转场动效，效果比较好的有：

* zoomin/zoomout
* move
* circle
* earthquake
* newspaper
* cover-diamond
* horizontal3d/horizontal
* vertical3d
* cover-circle

```markdown
[slide]
[magic data-transition="earthquake"]
## 标题1
-----
<div class="columns3">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_11.png" height="450">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_10.png" height="450">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_12.png" height="450">
</div>
====
## 标题2
-----
<div class="columns3">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_11.png" height="450">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_10.png" height="450">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_12.png" height="450">
</div>

====
## 标题3
-----
<div class="columns3">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_11.png" height="450">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_10.png" height="450">
    <img src="/assets/searchbox-fe-framework-and-product/Snip20151209_12.png" height="450">
</div>

[/magic]
```

## theme 自定义
感觉默认的模板不符合新意？可以支持自定义模板，查看[theme.moon](https://github.com/ksky521/nodePPT/blob/master/assets/scss/theme.moon.scss)

自定义后的模板路径在markdown的设置里填写：

```markdown
title: 这是演讲的题目
speaker: 演讲者名字
url: 可以设置链接
transition: 转场效果，例如：zoomin/cards/slide
files: /css/theme.moon.css，尾部的文件
theme: moon //皮肤
highlightStyle: monokai_sublime //hljs的样式
headFiles: //头部的文件
usemathjax: //如果为yes，则引入mathjax，默认不建议开启，导出文件太多
date: 2015年12月20日
```

另外有：[colors](http://qdemo.sinaapp.com/?theme=color)-[moon](http://qdemo.sinaapp.com/?theme=moon)-[blue](http://qdemo.sinaapp.com/?theme=blue)-[dark](http://qdemo.sinaapp.com/?theme=dark)-[green](http://qdemo.sinaapp.com/?theme=green)-[light](http://qdemo.sinaapp.com/?theme=light) 共六套自带皮肤可供选择

```markdown
theme: moon
```
or url?theme=moon

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

### 打印/导出ppt
这么高端大气上档次的ppt，怎么能不导出分享给大家呢？？

使用``url?print=1``访问页面，然后选择chrome的系统打印即可


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
nodeppt generate ./ppts/demo.md output/path -a
```
导出目录下所有ppt，并且生成ppt list首页：

```bash
nodeppt path output/path -a
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


#### 单条动画
使用方法：列表第一条加上 ` {:&.动画类型}``（注意空格）

```markdown
* 上下左右方向键翻页
    * 列表支持渐显动画 {:&.moveIn}
    * 支持多级列表
    * 这个动画是moveIn
```

目前支持的单条动画效果包括：

* moveIn
* fadeIn
* bounceIn
* rollIn
* zoomIn

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
前端的ppt，难免会在页面中演示一些demo，除了上面的插入html语法外，还提供了```enter```和```outcallback```，分别用于：切入（切走）到当前ppt，执行的js函数名。例如：

```markdown
[slide data-on-leave="outcallback" data-on-enter="incallback"]
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



## Thanks
* http://tympanus.net/Development/ItemTransitions/index2.html
* http://tympanus.net/Development/PageTransitions/
* https://github.com/daneden/animate.css




