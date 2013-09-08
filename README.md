nodePPT v0.4.0
=============

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

```shell
nodeppt create slideName
```

### 帮助

```shell
nodeppt -h
```

## demo演示 & 使用方法

 * 启动 nodeppt
 * 访问 http://127.0.0.1:8080/