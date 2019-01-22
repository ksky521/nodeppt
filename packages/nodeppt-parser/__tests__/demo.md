title: nodeppt markdown 演示
speaker: 三水清
url: https://github.com/ksky521/nodeppt
transition: slide3
files: /js/demo.js,/css/demo.css,/js/zoom.js
theme: moon
plugins:

- echarts

<slide class="bg-purple aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/@.dark">

# nodeppt

## 这可能是迄今为止最好的网页版演示库

<slide video="https://webslides.tv/static/videos/peggy.mp4@.dark@https://webslides.tv/static/images/peggy.jpg">

## 为什么选择 nodeppt

- 基于 GFM 的 markdown 语法编写 {..rollIn}
- 支持 html 混排，再复杂的 demo 也可以做！
- 导出网页或者 pdf 更容易分享
- 支持单页背景图片
- 多种模式：纵览模式，双屏模式，远程控制
- 可以使用画板，可以使用 note 做备注
- 支持语法高亮，自由选择 highlight 样式
- 可以单页 ppt 内部动效，单步动效
- 支持进入/退出回调，做在线 demo 很方便

<slide>

## 为什么选择 nodeppt

<column class="vertical-align">
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

```html
<article id="webslides">
  <!-- Slide 1 -->
  <section><h1>Design for trust</h1></section>
  <!-- Slide 2 -->
  <section class="bg-primary">
    <div class="wrap"><h2>.wrap = container (width: 90%)</h2></div>
  </section>
</article>
```

</column>

<slide :class="size-50">
### Let's check out some examples.
All content is for demo purposes only.

---

1. Welcomes {..text-cols}
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

<slide class="aligncenter">

## Welcomes ::.text-landing

**WebSlides** is an open source tool for telling stories. ::.text-intro

<nav>
* [Twitter](https://twitter.com/webslides)
* [Dribbble](https://twitter.com/webslides)
* [Github](https://twitter.com/webslides)
</nav>

<slide class="bg-secondary" :class="size-50 frame">

## How to Tell Your Story? ::.text-serif.aligncenter

\* \* \* ::.text-symbols

Stories have the power to change the world. WebSlides helps you write better content, faster. Your slides are there to support your story. Choose words wisely, create meaning with them, keep it simple.

<slide :class="size-60">

### **Why WebSlides**? Good karma and productivity.

---

<shadowbox>
## We're web people.
There're excellent presentation tools out there. WebSlides is about telling the story, and sharing it in a beautiful way. Hypertext and clean code as narrative elements.

---

## Work better, faster.

Designers, marketers, and journalists can now focus on the content. Simply [choose a demo](https://webslides.tv/demos) and customize it in minutes.
</shadowbox>

<slide image="https://source.unsplash.com/Vti8XHv2XjU/" class="bg-black aligncenter">
# **California** {.text-shadow}

<footer>
  [iOS app](#)
  [iOS app](#)
  [iOS app](#)

</footer>

<slide class="bg-gradient-v" :class="size-60" image="https://source.unsplash.com/nxfuA21kNHY/1440x1440@.dark">

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

<slide :class="aligncenter">

## **Abouts & Teams**

<slide class="bg-primary">

<flexblock>

![](https://webslides.tv/static/images/logos/google.svg)

---

![](https://webslides.tv/static/images/logos/netflix.svg)

---

![](https://webslides.tv/static/images/logos/microsoft.svg)
</flexblock>

<slide>
## ul.flexblock.steps
<flexblock type="steps">

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

</flexblock>

<slide>

<column>
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

</column>

<slide>
  ### Team

<gallery>
![](https://source.unsplash.com/E6MWxCjNhYs/800x600)

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

</gallery>

<slide>
## echarts {.aligncenter}
```echarts
{
      "xAxis": {
          "type": "category",
          "data": [
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
              "Sun"
          ]
      },
      "yAxis": {
          "type": "value"
      },
      "series": [
          {
              "data": [
                  820,
                  932,
                  901,
                  934,
                  1290,
                  1330,
                  1320
              ],
              "type": "line"
          }
      ]
}

```

<slide>

## flexblock

<flexblock>
# dfdafafa

dfadsfasfasf

---

# dfdafafa

dfadsfasfasf

---

# dfdafafa

dfadsfasfasf
dfdasf

</flexblock>
```
