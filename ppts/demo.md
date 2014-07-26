title: nodeppt markdown 演示
speaker: Theo Wang
url: https://github.com/ksky521/nodePPT
transition: slide
files: /js/demo.js,/css/demo.css

[slide]

# 封面样式
## h1是作为封面用的，内部的都用h2
<small>演讲者：xxx</small>

[slide]

# 封面样式2 {:&.flexbox.vleft}
## 左对齐

[slide style="background-image:url('/img/bg1.png')"]

# 背景图片 {:&.flexbox.vleft}
## 使用方法：&#91;slide style="background-image:url('/img/bg1.png')"&#93;

[slide]
## 使用.class/#id/自定义属性样式
----

```html
使用：.class{:.class}
使用：#id{:#id}
组合使用：{:.class.class2 width="200px"}
父元素样式使用&：{:&.class}
```

[slide]

## 主页面样式
### ----是上下分界线
----

nodeppt是基于nodejs写的支持 **Markdown!** 语法的网页PPT

nodeppt：https://github.com/ksky521/nodePPT

[slide]

## 这是一个列表
---

* 上下左右方向键翻页
    * 列表支持渐显动画 {:&.moveIn}
    * 支持多级列表
    * 这个动画是moveIn
* 完全基于markdown语法哦


[slide]
## 列表渐显动画：fadeIn
----
* 列表支持渐显动画哦 {:&.fadeIn}
    * 使用方法，markdown列表第一条加上：{:&.动画类型}
* 动画类型
    * fadeIn
    * bounceIn
    * moveIn
    * zoomIn

[slide]
## 列表渐显动画：zoomIn
----
* 列表支持渐显动画哦 {:&.zoomIn}
* 动画类型
    * fadeIn
    * bounceIn
    * moveIn
    * zoomIn

[slide]
## 列表渐显动画：bounceIn
----
* 列表支持渐显动画哦 {:&.bounceIn}
* 动画类型
    * fadeIn
    * bounceIn
    * moveIn
    * zoomIn



[slide]
## 表格示例
### 市面上主要的css预处理器：Less\Sass\Stylus
---
| | Less | Sass | Stylus
:-------|:------:|-------:|--------
环境 |js/nodejs | Ruby(这列右对齐) | nodejs(高亮) {:.highlight}
扩展名 | .less | .scss/.sass | .styl
特点 | 老牌，用户多，支持js解析 | 功能全，有成型框架，发展快 | 语法多样，小众
案例/框架 | [Bootstrap](http://getbootstrap.com/) | [Compass](http://beta.compass-style.org) [Bootstrap](http://getbootstrap.com/css/#sass) [Foundation](http://foundation.zurb.com/) [Bourbon](http://bourbon.io) [Base.Sass](https://github.com/jsw0528/base.sass) |


[slide]
## 一些Tag的样式，多个背景测试
----

<button>按钮</button>

<a href="#">链接</a>

> 这是一个blockquote <small>small一下</small>

这是一个p标签

> 这是一个class是：pull-right的blockquote <small>small一下</small> {:&.pull-right}

[slide]
## 一些Tag的样式，多个背景测试
----

<button>按钮</button>

<a href="#">链接</a>

> 这是一个blockquote <small>small一下</small>

这是一个p标签

> 这是一个class是：pull-right的blockquote <small>small一下</small> {:&.pull-right}

[slide]
## 一些Tag的样式，多个背景测试
----

<button>按钮</button>

<a href="#">链接</a>

> 这是一个blockquote <small>small一下</small>

这是一个p标签

> 这是一个class是：pull-right的blockquote <small>small一下</small> {:&.pull-right}

[slide]

## 代码格式化
### 使用 `highlightjs` 进行语法高亮
----
<div class="columns-2">
    <pre><code class="javascript">(function(window, document){
    var a = 1;
    var test = function(){
        var b = 1;
        alert(b);
    };
    //泛数组转换为数组
    function toArray(arrayLike) {
        return [].slice.call(arrayLike);
    }
}(window, document));
    </code></pre>
    <pre><code class="javascript">(function(window, document){
    var a = 1;
    var test = function(){
        var b = 1;
        alert(b);
    };
    //泛数组转换为数组
    function toArray(arrayLike) {
        return [].slice.call(arrayLike);
    }
}(window, document));
    </code></pre>
</div>

[slide data-incallback="testScriptTag"]
## 支持 HTML 和 markdown 语法混编
----

<div class="file-setting">
    <p>这是html</p>
</div>
<p id="css-demo">这是css样式</p>
<p>将html代码直接混编到**markdown**文件中即可</p>

我是js控制的颜色 black {:#testScriptTag}

<script>
    function testScriptTag(){
        document.getElementById('testScriptTag').style.color = 'black';
    }

</script>
<style>
#css-demo{
    color: red;
}
</style>


[slide]
## iframe效果
----
<iframe data-src="http://www.baidu.com" src="about:blank;"></iframe>

[slide]
## 动画样式强调
----

这段话里面的**加粗**和*em*字体会动画哦~

按下【H】键查看效果


[slide]

## 图片，点击全屏
----

![小萝莉](/girl.jpg "小萝莉")


[slide]
[note]
##这里是note

使用n键，才能显示
[/note]
## 使用note笔记
### note笔记是多窗口，或者自己做一些笔记用的
---
按下键盘【N】键测试下note，

markdown语法如下：
```markdown
[note]
这里是note，{ 要换成中括号啊！！
{/note]
```
[slide]

## 使用画笔
### 使用画笔做标记哦~你也可以随便作画啊！
---
按下键盘【P】键。按下鼠标左键，在此处乱花下看看效果。

按下键盘【C】键。清空画板

[slide]

## 宽度不够？？
---
按下键盘【W】键，切换到更宽的页面看效果，第二次按键返回

 |less| sass | stylus
:-------|:------:|-------:|--------
环境 |js/nodejs | Ruby(这列右对齐) | nodejs(高亮) {:.highlight}
扩展名 | .less | .sass/.scss | .styl
特点 | 老牌，用户多，支持js解析 | 功能全，有成型框架，发展快 | 语法多样，小众
案例/框架 | [Bootstrap](http://getbootstrap.com/) | [compass](http://compass-style.org) [bourbon](http://bourbon.io) |

[slide]
## 使用overview模式
---
按下键盘【O】键。看下效果。

在overview模式下，方向键下一页，【enter】键进入选中页

或者按下键盘【O】键，退出overview模式

[slide]

## 多窗口演示
## 双屏演示不out！
---
本页面网址改成 url?_muliscreen=1，支持多屏演示哦！

跟powderpoint一样的双屏功能，带有备注信息。

[slide]
## 18种转场动画随心换
----
 * slide/slide2/slide3
 * newspaper
 * glue
 * kontext/vkontext
 * move/circle
 * horizontal/horizontal3d
 * vertical3d
 * zoomin/zoomout
 * cards
 * earthquake/pulse/stick...

[slide data-transition="newspaper"]

## 这是一个newspaper的动画
----
使用方法（全局） 1：

> transition: newspaper


[slide data-transition="newspaper"]

## 这是一个newspaper的动画
----
使用方法 2：

&#91;slide data-transition="newspaper"&#93;


[slide data-transition="glue"]

## 这是一个glue的动画
----
使用方法（全局） 1：

> transition: glue


[slide data-transition="glue"]

## 这是一个glue的动画
----
使用方法 2：

&#91;slide data-transition="glue"&#93;

[slide data-transition="zoomin"]

## 这是一个zoomin的动画
----
使用方法：

&#91;slide data-transition="zoomin"&#93;

[slide data-transition="vertical3d"]

## 这是一个vertical3d的动画
----
使用方法：

&#91;slide data-transition="vertical3d"&#93;

[slide data-outcallback="outcallback" data-incallback="incallback" ]
## 使用回调
----

* &#91;slide data-outcallback="fnName"&#93;
    * 进入执行回调incallback函数
* &#91;slide data-incallback="fnName"&#93;
    * 退出执行outcallback函数

亦可以组合写：

> &#91;slide data-outcallback="foo" data-incallback="bar"&#93;


<p id="incallback"></p>
<p id="outcallback"></p>

[slide]
## 设置slide？
### 修改 markdown 文件头部内容
----

``` javascript
title: nodeppt markdown 演示 //演讲主题名字
speaker: Theo Wang //演讲者名称
url: https://github.com/ksky521/nodePPT //网址
transition: zoomin //通用动画名称，可在
files: /js/demo.js,/css/demo.css //引入的文件，在页面底部
```
[slide]

## 更多玩法
---
https://github.com/ksky521/nodePPT

什么？这些功能还不够用？

socket远程控制可以在手机上摇一摇换页哦~

查看项目目录ppts获取更多帮助信息
