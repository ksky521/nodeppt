nodeppt 2.0 - 累死累活干不过做PPT的！
=============
查看效果：[http://js8.in/nodeppt/](http://js8.in/nodeppt/)

**两年没更新了。。。出来混总是要还的，所以有了2.0版本！**

**nodeppt 2.0** 基于[webslides](https://github.com/webslides/WebSlides)、webpack、markdown-it、posthtml重构，新效果

## 安装

```bash
npm install -g nodeppt
```

## shell使用
简化了，就三个命令：

* new：使用线上模板创建一个新的 md 文件
* serve：启动一个 md 文件的webpack dev server
* build：编译产出一个 md 文件

```bash
# create a new slide with an official template
$ nodeppt new slide.md

# create a new slide straight from a github template
$ nodeppt new slide.md -t username/repo

# start local sever show slide
$ nodeppt serve slide.md

# to build a slide
$ nodeppt build slide.md
```

### 帮助

```bash
# help
nodeppt -h
# 获取帮助
nodeppt serve -h
```

## 演讲者模式
nodeppt 有演讲者模式，在页面 url 后面增加`?mode=speaker` 既可以打开演讲者模式，双屏同步

## 快捷键

* F：全屏
* -：总览模式
* 方向键/空格：翻页
* HOME/END：第一页和最后一页

## 公共资源：public 文件夹

如果项目文件夹下，存在`public`文件夹，可以直接通过 url 访问，参考`webpack dev server`的 `contentBase` 选项。

在`build`的时候，public 文件夹中的文件会完全 copy 到`dist`文件夹中

## 编写
最佳体验是 chrome 浏览器，本来就是给做演示用的，所以就别考虑非 Chrome 浏览器兼容问题了！

这里说下怎么编写。
### 基本语法
整个 markdown 文件分为两部分，第一部分是写在最前面的**配置**，然后是使用`<slide>`隔开的每页幻灯片内容。

### 配置
nodeppt 的配置是直接写在 md 文件顶部的，采用 yaml 语法，例如下面配置：

```yaml
title: nodeppt markdown 演示
speaker: 三水清
url: https://github.com/ksky521/nodeppt
js:
    - https://www.echartsjs.com/asset/theme/shine.js
prismTheme: solarizedlight
plugins:
    - echarts
    - katex
```

* title: 演讲主题
* speaker：演讲者
* url：地址
* js：js 文件数组，放到 body 之前
* css：css 文件数组，放到头部
* prismTheme：prism 配色，取值范围 `['dark', 'coy', 'funky', 'okaidia', 'tomorrow', 'solarizedlight', 'twilight']`
* plugins：目前支持 [echarts](https://echarts.baidu.com/) 和 [katex](https://katex.org) 两个插件

#### 插件
目前 nodeppt 支持 [echarts](https://echarts.baidu.com/) 和 [katex](https://katex.org) 两个插件。
#### echarts
echarts 主题配色可以直接在`yaml`配置的 js 中引入。echarts 采用`fence`语法，如下：

```echarts
{
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
    }]
}
```

#### ketex

参考：[markdown-it-katex](https://www.npmjs.com/package/markdown-it-katex)


### `<slide>` 语法
nodeppt 会根据`<slide>`对整个 markdown 文件进行拆分，拆成单页的幻灯片内容。`<slide>` 标签支持下面标签：

* class/style等：正常的 class 类，可以通过这个控制居中（aligncenter），内容位置，背景色等
* image：背景图片，基本语法 `image="img_url"`
* video：背景视频，基本语法 `video="video_src1,video_src2"`
* :class：wrap 的 class，下面详解

每个 slide 会解析成下面的 html 结构：

```html
<section class="slide" attrs...>
    <div class="wrap" wrap="true">
        // 具体 markdown 渲染的内容
    </div>
</section>
```
其中`<slide>` 的`class`等会被解析到 `<section>`标签上面，而`:class`则被解析到`div.wrap`上面，例如：

```html
<slide :class="size-50" class="bg-primary">
```

output 为：
```html
<section class="slide bg-primary" >
    <div class="wrap size-50" wrap="true">
        // 具体 markdown 渲染的内容
    </div>
</section>
```

#### 背景：图片
`<slide>`的`image` 会被解析成背景大图，常见的支持方式有：

```md
<slide image="https://source.unsplash.com/UJbHNoVPZW0/">

# 这是一个普通的背景图

<slide image="https://source.unsplash.com/UJbHNoVPZW0/ .dark">

# 这张背景图会在图片上面蒙一层偏黑色的透明层


<slide image="https://source.unsplash.com/UJbHNoVPZW0/ .light">

# 这张背景图会在图片上面蒙一层偏白色的透明层


<slide class="bg-black aligncenter" image="https://source.unsplash.com/n9WPPWiPPJw/ .anim">

# 这张背景图会缓慢动

```

详见[site/background.md](./site/background.md)和[在线演示](https://js8.in/nodeppt/background.html)

### 样式

样式太多，具体详见[site/classes.md](./site/classes.md)和[在线演示](https://js8.in/nodeppt/classes.html)

### 布局
nodeppt 这次使用`webslides`的布局，支持丰富的布局，实在太多了，直接看文档[site/layout.md](./site/layout.md)和[在线演示](https://js8.in/nodeppt/layout.html)


### attribute
参考[markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs)，支持了`attribute`，修改增加多 class 支持等功能。

其中：`..class`会往上一级节点添加 class，支持`{.class1.class2}`这种多 class 的语法。用法举例：

```markdown
# header {.style-me.class2}
paragraph {data-toggle=modal}
```
Output:
```html
<h1 class="style-me class2">header</h1>
<p data-toggle="modal">paragraph</p>
```

```markdown
Use the css-module green on this paragraph. {.text-intro}
```
Output:

```html
<p class="text-intro">Use the css-module green on this paragraph.</p>
```

```markdown
- list item **bold** {.red}
```
Output:
```html
<ul>
<li class="red">list item <strong>bold</strong></li>
</ul>
```

```markdown
- list item **bold**
{.red}
```
Output:

```html
<ul class="red">
<li>list item <strong>bold</strong></li>
</ul>
```

### image 增强
对于 image ，支持外面包裹一层的写法，具体语法 `!![](图片地址 属性)`，例如：

```markdown
!![](https://webslides.tv/static/images/iphone.png .size-50.alignleft)
```
Output：

```html
<img src="https://webslides.tv/static/images/iphone.png" class="size-50 alignleft">
```

```markdown
!![figure](https://webslides.tv/static/images/setup.png .aligncenter)

```

Output:

```html
<figure>
    <img src="https://webslides.tv/static/images/setup.png" class="aligncenter">
</figure>
```

### button
 nodeppt 的 button 是类似`link`语法的，支持蓝色、圆角、空心和 icon 版本的 button：
```markdown
[普通按钮](){.button} [圆角普通按钮](){.button.radius}

[空心](){.button.ghost} [:fa-github: 前面带icon](){.button}
```

### Icon：FontAwesome
nodeppt的 icon 支持 [FontAwesome](https://fontawesome.com/)
语法：

* `:fa-xxx:` → `<i class="fa fa-xxx"></i>`
* `:~fa-xxx:~` → `<span><i class="fa fa-xxx"></i></span>`
* `::fa-xxx::` → 块级`<i class="fa fa-xxx"></i>`，即不会被`p`包裹

### span

代码修改自[markdown-it-span](https://github.com/pnewell/markdown-it-span/)，支持 `attr`语法，基本用法：

```md
:span:
:span: {.text-span}
```

### 动效
nodeppt一如既往的支持动效，2.0版本支持动效主要是页面内的动效。

支持动效包括：

* fadeIn
* zoomIn
* rollIn
* moveIn
* fadeInUp
* slow

在需要支持的动效父节点添加`.build`或者在具体的某个元素上添加`.tobuild+动效 class`即可。

按照惯例，nodeppt 还支持`animate.css`的动效哦~

详细查看文件：[site/animation.md](./site/animation.md)和[在线演示](https://js8.in/nodeppt/animation.html)

### 使用强大的`:::`完成复杂布局
`:::`语法是扩展了 [markdown-it-container](https://www.npmjs.com/package/markdown-it-container) 语法，默认是任意 tag，例如

```markdown
:::div {.content-left}
## title
:::
```
Output：
```html
<div class="content-left">
    <h2>title</h2>
</div>
```
还支持，`tag` 嵌套，除此之外，支持的组件包括：

* card：卡片，一边是图片，一边是内容
* column：column 多栏布局
* shadowbox：带阴影的盒子
* steps：步骤组件
* cta：
* gallery：图片
* flexblock：flex block 布局，支持多个子类型

基本语法是：

```markdown
:::TYPE {.attrs}

## 第一部分
使用 hr 标签隔开

----

## 第二部分

这里的内容也是哦

:::
```

详细可以看 [component](./site/component.md) 部分的 markdown 文件和[在线演示](https://js8.in/nodeppt/component.html)

## 打印？导出 pdf？
chrome浏览器，直接在第一页 `command+P/ctrl+P` 即可

## 高级玩法
如果上面
### `nodeppt.config.js`
在nodeppt 执行路径下创建`nodeppt.config.js`文件，可以配置跟`webpack`相关的选项，另外可以支持自研 nodeppt 插件。

默认内置的`config.js`内容如下：

```js
/**
 * @file 默认配置
 */
module.exports = () => ({
    // project deployment base
    baseUrl: '/',

    // where to output built files
    outputDir: 'dist',

    // where to put static assets (js/css/img/font/...)
    assetsDir: '',

    // filename for index.html (relative to outputDir)
    indexPath: 'index.html',
    // 插件，包括 markdown 和 posthtml
    plugins: [],
    // chainWebpack: [],

    // whether filename will contain hash part
    filenameHashing: true,

    // boolean, use full build?
    runtimeCompiler: false,

    // deps to transpile
    transpileDependencies: [
        /* string or regex */
    ],

    // sourceMap for production build?
    productionSourceMap: true,

    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: () => {
        try {
            return require('os').cpus().length > 1;
        } catch (e) {
            return false;
        }
    },

    // multi-page config
    pages: undefined,

    // <script type="module" crossorigin="use-credentials">
    // #1656, #1867, #2025
    crossorigin: undefined,

    // subresource integrity
    integrity: false,

    css: {
        extract: true
        // modules: false,
        // localIdentName: '[name]_[local]_[hash:base64:5]',
        // sourceMap: false,
        // loaderOptions: {}
    },

    devServer: {
        /*
      host: '0.0.0.0',
      port: 8080,
      https: false,
      proxy: null, // string | Object
      before: app => {}
    */
    }
});

```

### parser plugin

解析插件分两类： `markdown-it` 和 `posthtml`，

* markdown-it：是解析 markdown 文件的，如果是增强markdown语法，可以用这类插件
* posthtml：是处理 html 标签的，如果是修改输出的 html 内容，可以用这类插件

定义一个 plugin ：

```js
module.exports = {
    // 这里的 id 必须以 markdown/posthtml开头
    // 分别对应 markdown-it和 posthtml 插件语法
    id: 'markdown-xxx',
    // 这里的 apply 是插件实际的内容，详细查看 markdown-it和 posthtml 插件开发
    apply: ()=>{}
}
```

* [markdown-it docs](https://github.com/markdown-it/markdown-it/tree/master/docs)
* [posthtml docs](https://github.com/posthtml/posthtml/tree/master/docs)

### webslides plugin
WebSlides 插件需要写到一个 js 文件中，然后作为数组放到`window.WSPlugins_`中，然后通过在md 页面的配置（yaml）添加 js 的方法引入。


```md
js:
    - webslide_plugins.js
```

```js
// webslide_plugins.js内容
window.WSPlugins_ = [{
    id: 'webslide_plugin_name',
    // 下面是对应的插件类
    apply: class Plugin{}
}]
```


参考[WebSlides文档](https://github.com/webslides/WebSlides/wiki/Plugin-development)

### Template：自制模板

参考[nodeppt-template-default](https://github.com/ksky521/nodeppt-template-default)。

然后使用`nodeppt new username/repo xxx.md`使用

## Thanks
* [WebSlides](https://github.com/webslides/WebSlides)
* [markdown-it](https://github.com/markdown-it/markdown-it)
* [posthtml](https://github.com/posthtml/posthtml)
* [webpack](https://github.com/webpack/webpack)
* [vue-cli](https://github.com/vuejs/vue-cli)




