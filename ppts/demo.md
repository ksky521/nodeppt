title: nodeppt markdown 演示
speaker: Theo Wang
url: https://github.com/ksky521/nodePPT
transition: zoomin

[slide]

# 封面样式
## h1是作为封面用的，内部的都用h2

[slide]

# 封面样式2 {:&.flexbox.vleft}
## 左对齐

[slide]

[bgimage]/img/bg1.png[/bgimage]

# 背景图片 {:&.flexbox.vleft}
## 使用方法：[bgimage]/img/bg.jpg[/bgimage]


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
## iframe
----
<iframe data-src="http://www.google.com/doodle4google/resources/history.html" src="about:blank;"></iframe>

[slide]

## 居中图片
----
{:.flexbox.vcenter}

![FEinit帮助界面](https://github.com/ksky521/FEinit/raw/master/pic/feinit.png "FEinit帮助界面")

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

## 哦 忘记说了
---
本页面网址改成 url#client，支持多窗口演示哦！

另外支持多种动画哦：

 * horizontal3d
 * horizontal
 * vertical3d
 * zoomin
 * zoomout
 * cards

当然你可以自己写更炫的动画啊，记得pull给我动画代码哦~

[slide]
## 怎么用？
### 修改 markdown 文件头部内容
----

``` javascript
title: nodeppt markdown 演示 //演讲主题名字
speaker: Theo Wang //演讲者名称
url: https://github.com/ksky521/nodePPT //网址
transition: zoomin //动画名称
```
[slide]

## 更多玩法
---
https://github.com/ksky521/nodePPT

什么？这些功能还不够用？

极客模式：查看源码的nodeppt.js，相信你会找到牛逼的手机互动（摇一摇换页）功能

