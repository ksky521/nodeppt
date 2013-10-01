nodePPT v0.4.8
=============
![nodePPT演示](https://raw.github.com/ksky521/nodePPT/master/demo.gif "nodePPT演示")

 * 重构代码，对MixJS依赖
 * 添加postMessage支持
 * 添加按键事件同步，添加overview等多种状态
 * 引用google slide template的css
 * 支持 markdown 语法，访问ppts目录查看demo

## 安装

```shell
npm install -g nodeppt
```

## shell使用

### 启动

```shell
nodeppt start -p port
```

```shell
nodeppt start -p port -d path/for/ppts
```

### 创建
支持markdown语法快速创建网页幻灯片。

类似下面的语法：(更多用法查看ppts/demo.md文件)
```markdown
title: nodeppt markdown 演示
speaker: Theo Wang
url: https://github.com/ksky521/nodePPT
transition: zoomin

[slide data-]

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

### 帮助

```shell
nodeppt -h
```

## demo演示 & 使用方法

 * 执行 nodeppt start -p 8080
 * 访问 http://127.0.0.1:8080/


