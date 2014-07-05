nodePPT - 让每个人都能写出高大上的网页版ppt！
=============
![nodePPT演示](https://raw.github.com/ksky521/nodePPT/master/demo.gif "nodePPT演示")
## 0.6.6
 * 添加slide动画
 * 修改帮助
 * overview状态下bugfix

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
nodeppt start -p 8080 -d path/for/ppts -h 127.0.0.1
# 使用socket通信（按Q键显示/关闭二维码，手机扫描，即可控制）
# socket须知：1、注意手机和pc要可以相互访问，2、防火墙，3、ip
nodeppt start -c socket
# 不加-c默认使用postMessage，窗口联动，即list页面【多窗口】链接
```
### 导出ppt
这么高端大气上档次的ppt，怎么能不导出分享给大家呢？？

导出ppt有两种，一种是**pdf版**，一种是**html版**

#### pdf版
需要安装[phantomJS](http://phantomjs.org/)。

```bash
# 安装phantomjs，如果安装了，请忽略
npm install -g phantomjs
# 启动nodeppt server
nodeppt start
# 导出文件
nodeppt pdf http://127.0.0.1:8080/md/demo.md -o a.pdf
```
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

### 创建
支持markdown语法快速创建网页幻灯片。

```bash
nodeppt create markdown_file_name
```

按照提示输入基本信息后就可以创建，默认创建是markdown版本，如果需要创建html版本，可以使用：

```bash
nodeppt create ppt-name.html
# or
nodeppt create ppt-name.htm
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


支持的转场动画包括：

 * horizontal3d
 * horizontal
 * vertical3d
 * zoomin
 * zoomout
 * cards
 * slide

如果设置单页动画，请参考下面的**单页动画设置**部分~

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

#### 单页动画设置
在md文件，顶部 ```配置``` 可以设置全局转场动画，如果要设置单页的转场动画，可以通过下面的语法

```markdown
[slide data-transition="vertical3d"]
## 这是一个vertical3d的动画
```

#### 插入html代码
如果需要完全diy自己的ppt内容，可以使用```[code][/code]``` 来包裹html代码。例如：

```markdown
[code]
<div class="file-setting">
    <p>这是html</p>
</div>
<p id="css-demo">这是css样式</p>
<p>使用&#91;code]&#91;/code]包裹的代码，会直接插入到页面</p>
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
[/code]
```

#### 出入回调
前端的ppt，难免会在页面中演示一些demo，除了上面的插入html语法：```[code][/code]``` 之外，还提供了```in-callback```和```out-callback```，分别用于：切换（切走）到当前ppt，执行的js函数名。例如：

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
 * 查看在线demo：[http://myslide.duapp.com/](http://myslide.duapp.com/)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/ksky521/nodeppt/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

