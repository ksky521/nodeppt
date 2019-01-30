
title: nodeppt 样式演示
speaker: 三水清
url: https://github.com/ksky521/nodeppt

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">

Classes{.text-subtitle.animated.fadeInDown.delay-800}
# nodeppt {.text-landing.text-shadow}

这可能是迄今为止最好的网页版演示库 {.text-intro}

[:fa-github: Github](https://github.com/ksky521/nodeppt){.button.ghost}


<slide :class="size-50">

##  :fa-heart-o: CSS Syntax

WebSlides is so easy to understand and love. Baseline\: 8. {.text-intro}

* :Typography\::{.text-label}  .text-landing, .text-subtitle, .text-data, .text-intro...
* :BG Colors\::{.text-label}  .bg-primary, .bg-blue,.bg-apple...
* :BG Images\::{.text-label} .background, .background-center-bottom...
* :Cards\::{.text-label} .card-60, .card-50, .card-40...
* :Sizes\::{.text-label} .size-50, .size-40...
* :Flex Blocks\::{.text-label} .flexblock.clients, .flexblock.gallery, .flexblock.metrics...
{.description}


<slide>

Optional · 500+ icons {.text-subtitle}
## [:fa-flag: Font Awesome](http://fontawesome.io/icons/) as SVG icons

```markdown
:fa-flag:
```


<slide>

:::column {.vertical-align}
### **WebSlides is really easy**
Each parent `<section>` in the #webslides element is an individual slide. {.text-intro}

Code is neat, scalable, and well documented. It uses **intuitive markup with popular naming conventions**. There's no need to overuse classes or nesting. **Based on** [SimpleSlides](https://github.com/jennschiffer/SimpleSlides) , by [Jenn Schiffer](http://jennmoney.biz) :)

----
```html
<article id="webslides">
  <!-- Slide 1 -->
  <section>
    <h1>Design for trust</h1>
  </section>
  <!-- Slide 2 -->
  <section class="bg-primary">
    <div class="wrap">
      <h2>.wrap = container (width: 90%) with fadein</h2>
    </div>
  </section>
</article>
```
:::

---
Vertical sliding? `<article id="webslides" class="vertical">` {.aligncenter}


<slide>

:::{.aligncenter}
### Simple CSS Alignments

Put content wherever you want.
:::

:::footer
Footer: logo, credits... (.alignleft) {.alignleft}

[:fa-twitter: @username .alignright](){.alignright}

:::

:::header
Header (logo) :.alignright:{.alignright}
:::


<slide>

!![](https://webslides.tv/static/images/iphone.png .size-50.alignleft)

## img.alignleft
`img.alignleft.size-50`

Jobs unveiled the iPhone to the public on January 9, 2007, at the Macworld 2007 convention at the Moscone Center in San Francisco.  Apple sold 6.1 million first generation iPhone units over five quarters.

**Image size recommended**:<br> 800x600px / 600x450px.


<slide>

!![](https://webslides.tv/static/images/iphone.png .size-50.alignright)

## img.alignright
`img.alignright.size-50`

Jobs unveiled the iPhone to the public on January 9, 2007, at the Macworld 2007 convention at the Moscone Center in San Francisco.  Apple sold 6.1 million first generation iPhone units over five quarters.

**Image size recommended**:<br> 800x600px / 600x450px.

<slide>

!![](https://webslides.tv/static/images/iphone.png .size-40.aligncenter)

`img.aligncenter.size-40` {.aligncenter}




<slide class="aligncenter">
# Landings {.text-landing}

`.text-landing`

<slide class="aligncenter">
# Landings {.text-landing}

Create a simple web presence. {.text-intro}

`.text-intro`

<slide class="aligncenter">

POWERED BY [#WEBSLIDES](https://twitter.com/search?f=tweets&vertical=default&q=%23WebSlides&src=typd) `.text-subtitle` {.text-subtitle}

# Landings {.text-landing}

Create a simple web presence. {.text-intro}

`.text-intro`

<slide class="bg-black aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/">
# **Landings** {.text-landing.text-shadow}

`.text-shadow` {.text-intro}

<slide class="bg-apple aligncenter">
## 4,235,678 {.text-data}

`.text-data`

<slide>

Why WebSlides? .text-context {.text-content}

## WebSlides is incredibly easy and versatile. The easiest way to make HTML presentations.

<slide>

`.text-cols (2 columns)`

:::div {.text-cols}

**Why WebSlides?** There are excellent presentation tools out there. WebSlides is about sharing content, essential features, and clean markup. **Each parent &lt;slide&gt;**  in the #webslides element is an individual slide.

**WebSlides help you build a culture of innovation and excellence**. When you're really passionate about your job, you can change the world. How to manage a design-driven organization? Leadership through usefulness, openness, empathy, and good taste.

:::

:::flexblock {.metrics}

:fa-phone:

Call us at 555.345.6789

----

:fa-twitter:

@username

----
:fa-envelope:
Send us an email
:::

<slide>
:::column {.vertical-align}

## A Phone by Google
Pixel's camera lets you take brilliant photos in low light, bright light or any light. {.text-intro}

* :Typography\::{.text-label}  .text-landing, .text-subtitle, .text-data, .text-intro...
* :BG Colors\::{.text-label}  .bg-primary, .bg-blue,.bg-apple...
* :BG Images\::{.text-label} .background, .background-center-bottom...
* :Sizes\::{.text-label} .size-50, .size-40...
* :Flex Blocks\::{.text-label} .flexblock.clients, .flexblock.gallery, .flexblock.metrics...
{.description}

----
![](https://webslides.tv/static/images/android.png)

:::

<slide class="aligncenter text-serif">

:::div {.content-left}
## WebSlides is incredibly easy and versatile.
`.text-serif`  (Maitree)
:::

:::div {.content-left}

Each parent `<slide>` in the #webslides element is an individual slide.

Clean markup with popular naming conventions. Minimum effort. Just focus on your content.

:::

<slide :class="size-50">

### **What is Stendhal Syndrome?**

Beauty overdose. `.text-pull-right` {.text-intro}

Imagine that you are in Florence. If you suddenly start to feel that you literally cannot breathe, you may be experiencing Stendhal Syndrome.

Psychiatrists have long debated whether it really exists. {.text-pull-right}

The syndrome is not only associated with viewing a beautiful place, but also good art.

The beauty of Italian art has a concentrated perfection and transcendent sensuality that is incredibly addictive.

<slide class="bg-primary">
# Design :for: understanding
:::flexblock {.features.fadeInUp}

:100^%^: purpose
## Businesses that people love

---
## :fa-heart-o: Principles

Useful → Easy → Fast → Beautiful
:::

<slide image="https://source.unsplash.com/yssUhIxbUZA/">

::: div {.content-left.bg-trans-dark.fadeInUp}
!![](https://webslides.tv/static/images/logos/airbnb.svg .whitelogo)

---

## **Designing Experiences**

Meet locals who share your interests.
:::

<slide class="bg-black slide-bottom" image="https://source.unsplash.com/RSOxw9X-suY/">

:::div {.content-left}
:fa-tree large:

## 1,000,000
### We're working to protect up to a million acres of sustainable forest.

:::

<slide class="bg-black-blue">

:::column
### **:fa-line-chart: Interface**

Design for growth. We've built a team of world-class designers, developers, and managers.

---
### **:fa-film: Videos**

We connect your audience needs, business goals, and brand values into a strategy.

---
### **:fa-users: Recruiting**

We offer personalized services with deep expertise in design and technology.

---
### **:fa-graduation-cap: Formation**

We train teams to help organizations succeed in the digital age.
:::


<slide>
## table

| Left-aligned | Center-aligned | Right-aligned |
| :----------- | :------------: | ------------: |
| git status   |   git status   |    git status |
| git diff     |    git diff    |      git diff |
| git status   |   git status   |    git status |

<slide class="aligncenter">

## avatar

![](https://avatars2.githubusercontent.com/u/1073262?s=40&v=4){.avatar-40}

 (80, 72, 64, 56, 48, and 40).

<slide class="aligncenter">

## Quote

<slide class="bg-black-blue" :class="size-50">
> I have always appreciated designers who dare to reinterpret fabrics and proportions, so I follow the Japanese and Belgian designers.
> ==Zaha Hadid==
> {.text-quote}

<slide image="https://webslides.tv/static/images/satya.png .left-bottom">

:::div {.content-right}
> "There is something only a CEO uniquely can do, which is set that tone, which can then capture the soul of the collective."
> ==Satya Nadella, CEO of Microsoft.==
:::


<slide>
:::card {.quote}



![](https://webslides.tv/static/images/davinci.png)

---
> “WebSlides helped us build a culture of innovation and excellence.”
> ==Leonardo da Vinci==



<slide>

::: {.content-left}
## button

[.button](){.button} [.button.radius](){.button.radius}

[.button.ghost](){.button.ghost} [:fa-github: svg-icon](){.button}
:::


<slide class="bg-primary" :class="size-50 frame">

## View More Demos? {.text-serif.aligncenter}

\* \* \* {.text-symbols}

<nav class="aligncenter">
* [:fa-th-large: Layout](./layout.html)
* [:fa-tv: Background](./background.html)
* [:fa-magic: Animation](./animation.html)
* [:fa-cube: Component](./component.html)
* [:fa-youtube: Media](./media.html)
* [:fa-css3: Classes](./classes.html)
</nav>

<slide class="aligncenter">

## U work so hard, **but** 干不过 write PPTs

快使用 [nodeppt](https://github.com/ksky521/nodeppt) 轻松搞定高大上PPT<br/> nodeppt 助力你的人生逆袭之路！ {.text-into}

[:fa-cloud-download: Github](https://github.com/ksky521/nodeppt){.button}
