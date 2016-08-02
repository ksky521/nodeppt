nodePPT - This is probably the best web presentation tool so far!
==================================
中文说明：[README](./README.md)

[![NPM](https://nodei.co/npm-dl/nodeppt.png)](https://nodei.co/npm/nodeppt/)
[![NPM](https://nodei.co/npm/nodeppt.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nodeppt/)
[![Inline docs](http://inch-ci.org/github/ksky521/nodePPT.svg?branch=master)](http://inch-ci.org/github/ksky521/nodePPT)

## why nodePPT?

 * markdown based on GFM;
 * mix-code with html and markdown
 * export your work with html and pdf format;
 * 18 different transition animations, and you can choose single page animation well;
 * Setting one page background image different than others;
 * overview mode, multiscreen mode, remote control with socket, shake to page-flipping with ipad/iphone;
 * canvas is also supported, with socket, we **sync your multiscreen in real time**, and you can type some notes;
 * syntax highlighting of course, and you may want to customize your [syntax highlighting style](https://highlightjs.org/), it's supported well;
 * Animation in single page, one-step animation;
 * themes：[colors](http://qdemo.sinaapp.com/)-[moon](http://qdemo.sinaapp.com/?theme=moon)-[blue](http://qdemo.sinaapp.com/?theme=blue)-[dark](http://qdemo.sinaapp.com/?theme=dark)-[green](http://qdemo.sinaapp.com/?theme=green)-[light](http://qdemo.sinaapp.com/?theme=light)
 * [forward and backward callback function](#callback)

## 1.2.0 new features
 * real time sync canvas drawing across multiple devices
 * watch
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

##### with url params

```bash
http://127.0.0.1:8080/md/demo.md?controller=socket
```

type 'Q' in page to show the QR Code, scan it, and you can control the slider on your phone: swipe or touch or shake to page-flipping

##### or use 'start' command:

```bash
nodeppt start -c socket
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
nodeppt pdf http://127.0.0.1:8080/md/demo.md a.pdf
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
```
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
you can use ```incallback```or```outcallback``` to define your callback function while the page forward and backward.
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
```

#### insert iframe
use ```data-src``` as the url of the iframe, the iframe will not load the content untill the page be displayed.
```markdown
<iframe data-src="http://www.baidu.com" src="about:blank;"></iframe>
```

#### example
for more go to ppts/demo.md

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


## Thanks
* http://tympanus.net/Development/ItemTransitions/index2.html
* http://tympanus.net/Development/PageTransitions/
* https://github.com/daneden/animate.css

