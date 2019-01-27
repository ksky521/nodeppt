title: nodeppt markdown 演示
speaker: 三水清
url: https://github.com/ksky521/nodeppt
js:
    - https://www.echartsjs.com/asset/theme/shine.js
prismTheme: solarizedlight
plugins:
    - echarts
    - katex



<slide>
## Corporate Backgrounds
:::blink

## .bg-primary {..bg-primary ..href="abc"}

\#44d

----

## .bg-secondary {..bg-secondary}

\#67d

----

## .bg-light {..bg-light}

\#edf2f7

----

## body

\#f7f9fb

:::


<slide>
## Corporate Backgrounds
:::flexbox

## .bg-primary {..bg-primary}

\#44d

----

## .bg-secondary {..bg-secondary}

\#67d

----

## .bg-light {..bg-light}

\#edf2f7

----

## body

\#f7f9fb

:::

----

## General Colors
:::flexbox

## .bg-black {..bg-black}

\#111

----

## .bg-black-blue {..bg-black-blue}

\#123

----

## .bg-white {..bg-white}

\#fff
:::

<slide>

## Colorful
:::flexbox

## .bg-red {..bg-red}

\#c23

----

## .bg-green {..bg-green}

\#077

----

## .bg-blue {..bg-blue}

\#346

----

## .bg-purple {..bg-purple}

\#62b

:::

----

### Transparent Backgrounds

:::flexbox

## .bg-trans-dark {..bg-trans-dark}

rgba(0, 0, 0, 0.5)

----

## .bg-trans-light {..bg-trans-light}

rgba(255, 255, 255, 0.2)

:::

<slide class="bg-gradient-h">
# Gradients

:::flexbox {.border}

Horizontal
`.bg-gradient-h`

----

 Radial
`.bg-gradient-r`

----
Vertical
`.bg-gradient-v`
:::

<slide class="bg-gradient-v aligncenter">
## Vertical Gradient

`.bg-gradient-v`

<slide class="bg-gradient-r aligncenter">
## Radial Gradient

`.bg-gradient-r`

<slide class="bg-apple aligncenter">
## One more background :)

`.bg-apple`



<slide class="bg-purple aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">

# nodeppt

## 这可能是迄今为止最好的网页版演示库

<slide class="bg-blue aligncenter" video='https://webslides.tv/static/videos/peggy.mp4 .dark poster="https://webslides.tv/static/images/peggy.jpg"'>

# 为什么选择 nodeppt

`section.bg-blue > .background-video.dark` or `.light`


<slide class="" :class="size-40">

### 为什么选择 nodeppt

- 基于 GFM 的 markdown 语法编写
- 支持 html 混排，再复杂的 demo 也可以做！
- 导出网页或者 pdf 更容易分享
- 支持单页背景图片
- 多种模式：纵览模式，双屏模式，远程控制
- 可以使用画板，可以使用 note 做备注
- 支持语法高亮，自由选择 highlight 样式
- 可以单页 ppt 内部动效，单步动效
- 支持进入/退出回调，做在线 demo 很方便
{.build.fadeIn}

<slide>

## 为什么选择 nodeppt

:::column {.vertical-align}

- 基于 GFM 的 markdown 语法编写
- 支持 html 混排，再复杂的 demo 也可以做！
- 导出网页或者 pdf 更容易分享
- 支持单页背景图片
- 多种模式：纵览模式，双屏模式，远程控制
- 可以使用画板，可以使用 note 做备注
- 支持语法高亮，自由选择 highlight 样式
- 可以单页 ppt 内部动效，单步动效
- 支持进入/退出回调，做在线 demo 很方便

---
```html {..fadeInUp..slow}
<article id="webslides">
  <!-- Slide 1 -->
  <section>
    <h1>Design for trust</h1>
  </section>
  <!-- Slide 2 -->
  <section class="bg-primary">
    <div class="wrap">
      <h2>.wrap = container (width: 90%)</h2>
    </div>
  </section>
</article>
```
:::

<slide class="frame moveIn" :class="size-60 bg-white tobuild">

### :fa-info-circle large: **Autoplay Feature**

Autoplay is generally disabled on all mobile devices to prevent bandwidth consumption. User must execute the play manually. {.text-intro}


<slide>

## Header & Footer

:::header {.abeee}
### Header
:::


:::footer
### Footer

:::

:::note
### Note

:::

<slide class="bg-brown">

:::column

::fa-heart large::

### **Feature 1**

Test your web and mobile designs, and quickly incorporate user feedback.

---

::fa-heart large::

### **Feature 1**

Test your web and mobile designs, and quickly incorporate user feedback.

---

::fa-heart large::

### **Feature 1**

Test your web and mobile designs, and quickly incorporate user feedback.

:::

<slide>

::: {.content-left}
## button

[.button](){.button} [.button.radius](){.button.radius}

[.button.ghost](){.button.ghost} [:fa-github: svg-icon](){.button}
:::



<slide :class="size-50">
### Let's check out some examples.
All content is for demo purposes only.

---

1. Welcomes
2. Covers
3. Abouts & Teams
4. Features & Benefits
5. Cards
6. Metrics & Data
7. Pricing & Offers
8. Quotes
9. Buttons & Badges
10. Forms
11. SVG Icons
12. Logos
13. CSS Animations
14. Embedding videos, maps, charts...
{.text-cols}

<slide class="aligncenter">

## Welcomes {.text-landing}

**WebSlides** is an open source tool for telling stories. {.text-intro}

<nav>
* [Twitter](https://twitter.com/webslides)
* [Dribbble](https://twitter.com/webslides)
* [Github](https://twitter.com/webslides)
</nav>

<slide class="bg-secondary" :class="size-50 frame">

## How to Tell Your Story? {.text-serif.aligncenter}

\* \* \* {.text-symbols}

Stories have the power to change the world. WebSlides helps you write better content, faster. Your slides are there to support your story. Choose words wisely, create meaning with them, keep it simple.

<slide :class="size-60">

### **Why WebSlides**? Good karma and productivity.

---

:::shadowbox

## We're web people.

There're excellent presentation tools out there. WebSlides is about telling the story, and sharing it in a beautiful way. Hypertext and clean code as narrative elements.

---

## Work better, faster.

Designers, marketers, and journalists can now focus on the content. Simply [choose a demo](https://webslides.tv/demos) and customize it in minutes.

:::

<slide image="https://source.unsplash.com/Vti8XHv2XjU/" class="bg-black aligncenter">
# **California** {.text-shadow}

<slide class="bg-gradient-v" :class="size-60" image="https://source.unsplash.com/nxfuA21kNHY/1440x1440 .dark">

GOOD KARMA {.text-context}

## WebSlides is about **telling the story**, and sharing it in a beautiful way.

<slide class="bg-black aligncenter" image="https://source.unsplash.com/mGYxAWITqMg/">

Plan your next trip {.text-subtitle}

# Summ.er {.text-shadow}

The best places at the best price. {.text-intro}

<slide class="bg-black" image="https://source.unsplash.com/7waHOTcvcT4/">

\$975 {.text-data}

<slide class="bg-black slide-bottom" image="https://source.unsplash.com/Q1p7bh3SHj8/">

Location Intelligence {.text-subtitle}

## **The application of geographic mapping to data**


<slide image="https://source.unsplash.com/YMOHw3F1Hdk/">

::: {.alignright.size-50.bg-trans-dark}
New in London {.text-subtitle.text-serif}
### **Hotel Daenerys**

The Daenerys has facilities such as a 24-hour front desk, an elevator with access to all rooms, and a terrace with a garden where guests can enjoy breakfast during the summer.

[More info]()

:::


<slide :class="aligncenter">

## **Abouts & Teams**

<slide class="bg-primary">

:::flexbox

!![div](https://webslides.tv/static/images/logos/google.svg)

---

!![div](https://webslides.tv/static/images/logos/netflix.svg)

---

!![div](https://webslides.tv/static/images/logos/microsoft.svg)

:::

<slide>

::: {.content-center}
### ul.flexblock.specs

:::specs

## :fa-long-arrow-right: SIMPLE NAVIGATION
with arrow keys and swipe.

----

## :fa-link: Permalinks
Go to a specific slide. URL: #slide=number

---

## :fa-text-height: SVG ICONS
Font Awesome Kit.

:::
:::

<slide class="bg-red" image="https://source.unsplash.com/R1J6Z1cnJZc/ .dark">

:::cta

!![](https://webslides.tv/static/images/logos/netflix.svg .whitelogo)

---

## Watch TV shows anytime, anywhere

.frame.bg-red

:::

<slide class="bg-red frame">

:::cta

::^$^40::

---

## Watch TV shows anytime, anywhere

.frame.bg-red

:::

<slide class="bg-dark">

## Flexbox

:::flexbox

Founded

----


24M Subscribers


---

Founded

----


Revenue: $16M

---


Covers, cards, quotes...

----


Use multiples of 8.

---


Font Awesome Kit.

---


Bank: $32M

:::

<slide>

<slide class="bg-green">

## Metrics

:::flexbox {.border.metrics}

Founded
::1972::

----

::fa-users::

24M Subscribers


---

Founded
::64%::

----

:~fa-line-chart~:

Revenue: $16M

---

:~fa-building-o~:

Covers, cards, quotes...

----

:~fa-smile-o~:

Use multiples of 8.

---

:~fa-usd~:

Font Awesome Kit.

---

:~fa-university~:

Bank: $32M

:::

<slide>

## Features

:::features

## ::→:: SIMPLE NAVIGATION
with arrow keys and swipe.

----

## :fa-link: Permalinks

Go to a specific slide.

---

## :fa-clock-o: Permalinks

Go to a specific slide.

----

## ::40+:: BEAUTIFUL COMPONENTS
Covers, cards, quotes...

----

## :fa-text-height: VERTICAL RHYTHM
Use multiples of 8.

---

## ::500+:: SVG ICONS
Font Awesome Kit.

:::

<slide>
## About/Services/Clients

`ul.flexblock.blink.border`

:::blink

## Interfaces

When you're really passionate about your job, you can change the world.

---

## Interfaces

1. Architecture
2. Design
3. Development

---

## Interfaces

1. Architecture
2. Design
3. Development

---

## Interfaces

1. Architecture
2. Design
3. Development

---

## Interfaces

When you're really passionate about your job, you can change the world.

---

!![div .abc](https://webslides.tv/static/images/logos/google.svg .aligncenter.graylogo)

Acme hired us to help make the reading experience totally engaging.

---


!![div](https://webslides.tv/static/images/logos/google.svg .aligncenter.blacklogo)

Acme hired us to help make the reading experience totally engaging.

---

## Interfaces

1. Architecture
2. Design
3. Development

:::

<slide>
## ul.flexblock.steps

:::steps

:~fa-file~:
## Interfaces

When you're really passionate about your job, you can change the world.

---

## Interfaces

1. Architecture
2. Design
3. Development

---

## Interfaces

1. Architecture
2. Design
3. Development

---

## Interfaces

1. Architecture
2. Design
3. Development

:::

<slide>

:::column

### FAQs {.text-context}

WebSlides is an open source solution by

---

###### Why WebSlides?

There are excellent presentation tools out there. WebSlides is about good karma and sharing content. Hypertext, clean code, and beauty as narrative elements.

\* \* \* {.text-symbols}

###### Is WebSlides a framework?

We're all tired of heavy CSS frameworks. WebSlides is a starting point that provides basic

---

###### Why WebSlides?

There are excellent presentation tools out there. WebSlides is about good karma and sharing content. Hypertext, clean code, and beauty as narrative elements.

\* \* \* {.text-symbols}

###### Is WebSlides a framework?

We're all tired of heavy CSS frameworks. WebSlides is a starting point that provides basic

:::

<slide>
### Team

:::gallery

![](https://source.unsplash.com/uPGOEbjbVGA/800x600)

## Alicia Jiménez

Founder & CEO

---

![](https://source.unsplash.com/6anudmpILw4/800x600)

## Sam Trololovitz

Master of nothing

---

![](https://source.unsplash.com/IFxjDdqK_0U/800x600)

## Erin Gustafson

VP of Design

:::

<slide>
### Team

:::gallery overlay

![](https://source.unsplash.com/uPGOEbjbVGA/800x600)

## Alicia Jiménez

Founder & CEO

---

![](https://source.unsplash.com/zhkTCCmD4xI/800x600)

## Sam Trololovitz

CTO

---

![](https://source.unsplash.com/IFxjDdqK_0U/800x600)

## Erin Gustafson

VP of Design

:::

<slide>
## echarts {.aligncenter}
```echarts {style="height:400px;"}
{
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直达', selected:true},
                {value:679, name:'营销广告'},
                {value:1548, name:'搜索引擎'}
            ]
        },
        {
            name:'访问来源',
            type:'pie',
            radius: ['40%', '55%'],
            label: {
                normal: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        // abg: {
                        //     backgroundColor: '#333',
                        //     width: '100%',
                        //     align: 'right',
                        //     height: 22,
                        //     borderRadius: [4, 4, 0, 0]
                        // },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },
            data:[
                {value:335, name:'直达'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1048, name:'百度'},
                {value:251, name:'谷歌'},
                {value:147, name:'必应'},
                {value:102, name:'其他'}
            ]
        }
    ]
}

```


<slide>

:::card-50

![](https://source.unsplash.com/HoevDVvxInw/960x720)

---

## Bonsai

Bonsai is a Japanese art form using trees grown in containers — .fullscreen > .card-50. {.text-intro}

Similar practices exist in other cultures, including the Chinese tradition of penjing from which the art originated, and the miniature living landscapes of Vietnamese hòn non bộ.

\* \* \* {.text-symbols}

Similar practices exist in other cultures, including the Chinese tradition of penjing from which the art originated, and the miniature living landscapes of Vietnamese hòn non
:::


<slide class="fullscreen">

:::card

![](https://source.unsplash.com/ALtNa-uKy3M/)

---

## Bonsai

Bonsai is a Japanese art form using trees grown in containers — .fullscreen > .card-50. {.text-intro}

Similar practices exist in other cultures, including the Chinese tradition of penjing from which the art originated, and the miniature living landscapes of Vietnamese hòn non bộ.


\* \* \* {.text-symbols}

dfdasfs
:::


<slide class="bg-gradient-v">
## table

| Left-aligned | Center-aligned | Right-aligned |
| :----------- | :------------: | ------------: |
| git status   |   git status   |    git status |
| git diff     |    git diff    |      git diff |



<slide class="bg-gradient-v">

## KaTex {.aligncenter}

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | _wha?_                                                                                 |

<slide>

## **Why WebSlides?**

> "I feel guilty as a web designer when I have to use PowerPoint and Keynote. So I made #WebSlides."


<slide class="bg-black-blue">
> I have always appreciated designers who dare to reinterpret fabrics and proportions, so I follow the Japanese and Belgian designers.
> ==Zaha Hadid==
> {.text-quote}



<slide :class="aligncenter fadeInUp">
## The little things mean the most

.fadeInUp


<slide :class="aligncenter zoomIn size-40">

![](https://webslides.tv/static/images/android.png)

<slide :class="aligncenter">

## h2.fadeIn.slow {.fadeIn.slow}


