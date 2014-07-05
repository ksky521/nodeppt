title: nodeppt markdown 演示
speaker: Theo Wang
url: https://github.com/ksky521/nodePPT
transition: kontext
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
父元素样式：{:&.class}
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

* 列表支持淡入淡出 {:&.build}
    * 上下左右方向键翻页 {:&.build}
    * 支持多级列表
    * 使用方法，markdown列表第一条加上：{:&.build}
* 完全基于markdown语法哦

[slide]
## 表格示例
### 市面上主要的css预处理器：less\sass\stylus
---
 |less| sass | stylus
:-------|:------:|-------:|--------
环境 |js/nodejs | Ruby | nodejs
扩展名 | .less | .sass/.scss | .styl
特点 | 老牌，用户多，支持js解析 | 功能全，有成型框架，发展快 | 语法多样，小众
案例/框架 | [Bootstrap](http://getbootstrap.com/) | [compass](http://compass-style.org) [bourbon](http://bourbon.io) |

[slide]
## 表格示例2
### 市面上主要的css预处理器：less\sass\stylus
---
[code]
    <table>
        <thead>
            <tr>
            <th align="left"></th>
            <th align="center">less</th>
            <th align="right">sass</th>
            <th>stylus</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td align="left">环境</td>
            <td align="center"  class="highlight">js/nodejs</td>
            <td align="right">Ruby</td>
            <td>nodejs</td>
            </tr>
            <tr>
            <td align="left">扩展名</td>
            <td align="center">.less</td>
            <td align="right"  class="highlight">.sass/.scss</td>
            <td>.styl</td>
            </tr>
            <tr>
            <td align="left">特点</td>
            <td align="center">老牌，用户多，支持js解析</td>
            <td align="right">功能全，有成型框架，发展快</td>
            <td>语法多样，小众</td>
            </tr>
            <tr>
            <td align="left">案例/框架</td>
            <td align="center"><a href="http://getbootstrap.com/">Bootstrap</a></td>
            <td align="right"><a href="http://compass-style.org">compass</a> <a href="http://bourbon.io">bourbon</a></td>
            <td></td>
            </tr>
        </tbody>
    </table>
[/code]

[slide]
## 一些Tag的样式，多个背景
----

<button>按钮</button>

<a href="#">链接</a>

> 这是一个blockquote <small>small一下</small>

这是一个p标签

> 这是一个class是：pull-right的blockquote <small>small一下</small> {:&.pull-right}

[slide]
## 一些Tag的样式，多个背景
----

<button>按钮</button>

<a href="#">链接</a>

> 这是一个blockquote <small>small一下</small>

这是一个p标签

> 这是一个class是：pull-right的blockquote <small>small一下</small> {:&.pull-right}

[slide]
## 一些Tag的样式，多个背景
----

<button>按钮</button>

<a href="#">链接</a>

> 这是一个blockquote <small>small一下</small>

这是一个p标签

> 这是一个class是：pull-right的blockquote <small>small一下</small> {:&.pull-right}

[slide]

## 代码格式化
### 使用 **highlightjs**
----

```javascript
(function(window, document){
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
```
[slide]
## 支持 HTML 语法插入
----
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

[slide]
## iframe
----
<iframe data-src="http://www.baidu.com" src="about:blank;"></iframe>

[slide]

## 居中图片
----
{:.flexbox.vcenter}

![FEinit帮助界面](https://raw.github.com/ksky521/FEinit/master/pic/feinit.png "FEinit帮助界面")

npm install -g feinit

[slide]
[note]
##这里是note

使用n键，才能显示
[/note]
## 使用note笔记
### note笔记是多窗口，或者自己做一些笔记用的
---
按下键盘【n】键测试下note，

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
按下键盘【p】键。按下鼠标左键，在此处乱花下看看效果。

按下键盘【c】键。清空画板

[slide]

## 使用宽屏模式
---
按下键盘【w】键。看下效果。

再按下键盘【w】键。

[slide]
## 使用overview模式
---
按下键盘【o】键。看下效果。

在overview模式下，方向键下一页，【enter】键进入选中页

或者按下键盘【o】键，退出overview模式

[slide]

## 多窗口演示
## 双屏演示不out！
---
本页面网址改成 url?_muliscreen=1，支持多屏演示哦！

跟powderpoint一样的双屏功能，带有备注信息。

[slide]
## 多种转场动画随心换
----
 * newspaper
 * glue
 * kontext
 * move
 * horizontal3d
 * horizontal
 * vertical3d
 * zoomin
 * zoomout
 * cards

[slide data-transition="newspaper"]

## 这是一个newspaper的动画
----
使用方法：

&#91;slide data-transition="newspaper"&#93;


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
使用方法：

&#91;slide data-outcallback="outcallback" data-incallback="incallback"&#93;

即：

 * 进入执行回调incallback函数
 * 退出执行outcallback函数

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

极客模式：查看源码的nodeppt.js，相信你会找到牛逼的手机互动（摇一摇换页）功能

查看项目目录ppts获取更多帮助信息
