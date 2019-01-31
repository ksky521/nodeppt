
title: nodeppt Classes 演示
speaker: 三水清
url: https://github.com/ksky521/nodeppt
css:
 - https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,700,700i%7CMaitree:200,300,400,600,700&subset=latin-ext

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


<slide class="slide-top">
:::{.content-left}
### 1/9 left top
Put content wherever you want. Have less. Do more. Create beautiful solutions.

`.slide-top and .content-left`


<slide class="slide-top">
:::{.content-center}
### 2/9 center top
In a village of La Mancha, the name of which I have no desire to call to mind,

`.slide-top and .content-center`

<slide class="slide-top">
:::{.content-right}
### 3/9 right top
there lived not long since one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing.

`.slide-top and .content-right`


<slide>
:::{.content-left}
### 4/9 left top
An olla of rather more beef than mutton, a salad on most nights, scraps on Saturdays,

`.content-left`

<slide>
:::{.content-center}
### 5/9 center top
lentils on Fridays, and a pigeon or so extra on Sundays, made away with three-quarters of his income.

`.content-center`

<slide>
:::{.content-right}
### 6/9 right top
he rest of it went in a doublet of fine cloth and velvet breeches and shoes to match for holidays,

`.content-right`


<slide class="slide-bottom">
:::{.content-left}
### 7/9 left bottom
while on week-days he made a brave figure in his best homespun.

`.slide-bottom` and `.content-left`


<slide class="slide-bottom">
:::{.content-center}
### 8/9 center bottom
He had in his house a housekeeper past forty, a niece under twenty, and a lad for the field and market-place,

`.slide-bottom` and `.content-center`

<slide class="slide-bottom">
:::{.content-right}
### 9/9 right bottom
who used to saddle the hack as well as handle the bill-hook.

`.slide-bottom` and `.content-right`


<slide class="aligncenter">
## .grid + .column
Basic Grid (auto-fill and equal height). {.text-intro}

:::column

###### Why WebSlides?

There're excellent presentation tools out there. WebSlides is about good karma and sharing content. Hypertext, clean code, and beauty as narrative elements.


----

!![figure](https://webslides.tv/static/images/setup.png .aligncenter)

---
###### How easy is WebSlides?
You can create your own presentation instantly. Just a basic knowledge of HTML and CSS is required. Simply choose a demo and customize it.

:::

<slide class="aligncenter">
## .grid.**vertical-align** + .column
Basic Grid (auto-fill and equal height). {.text-intro}

:::column {.vertical-align}

###### Why WebSlides?

There're excellent presentation tools out there. WebSlides is about good karma and sharing content. Hypertext, clean code, and beauty as narrative elements.


----

!![figure](https://webslides.tv/static/images/setup.png .aligncenter)

---
###### How easy is WebSlides?
You can create your own presentation instantly. Just a basic knowledge of HTML and CSS is required. Simply choose a demo and customize it.

:::


<slide>
## .grid.**sm**  (sidebar + main)
----

:::column {.sm}

### .column 1

Stendhal syndrome is a psychosomatic disorder that causes rapid heartbeat, dizziness, fainting, confusion and even hallucinations when an individual is exposed to an experience of great personal significance, particularly viewing art.

---

## .column 2
The illness is named after the 19th-century French author Stendhal (pseudonym of Marie-Henri Beyle), who described his experience with the phenomenon during his 1817 visit to Florence in his book Naples and Florence: A Journey from Milan to Reggio.

When he visited the Basilica of Santa Croce, where Niccolò Machiavelli, Michelangelo and Galileo Galilei are buried, he saw Giotto's frescoes for the first time and was overcome with emotion.


:::


<slide>
## .grid.**ms**  ( main + sidebar)
----

:::column {.ms}

### .column 1
The illness is named after the 19th-century French author Stendhal (pseudonym of Marie-Henri Beyle), who described his experience with the phenomenon during his 1817 visit to Florence in his book Naples and Florence: A Journey from Milan to Reggio.

When he visited the Basilica of Santa Croce, where Niccolò Machiavelli, Michelangelo and Galileo Galilei are buried, he saw Giotto's frescoes for the first time and was overcome with emotion.


---

## .column 2

Stendhal syndrome is a psychosomatic disorder that causes rapid heartbeat, dizziness, fainting, confusion and even hallucinations when an individual is exposed to an experience of great personal significance, particularly viewing art.

:::


<slide>
## .grid.**sms**  ( sidebar + main + sidebar)
----

:::column {.sms}

### .column 1

Information architecture is considered to have been founded by Richard Saul Wurman.

----
### .column 2

Information architecture (IA) is the structural design of shared information environments; the art and science of organizing and labelling websites, intranets, online communities and software to support usability and findability; and an emerging community of practice focused on bringing principles of design and architecture to the digital landscape.


---

## .column 3
The difficulty in establishing a common definition for "information architecture" arises partly from the term's existence in multiple fields.

:::

<slide>

:::card


## Unsplash
.card-50.bg-white

 [Unsplash](http://Unsplash.com) is a really cool resource. It is a collection of Creative Commons Zero licensed photos that are really great. {.text-intro}

* :Role\::{.text-label} Frontend
* :client\::{.text-label} Acme
* :year\::{.text-label} 2018
{.description}

---
![](https://source.unsplash.com/rCOWMC8qf8A/)

:::


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

:::

<slide class="bg-apple aligncenter">

# Backgrounds

&lt;slide class="bg-apple"&gt;


<slide>
## Corporate Backgrounds
:::flexblock {.blink.border}

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
:::flexblock {.blink.border}

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
:::flexblock {.border.blink}

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

:::flexblock {.border.blink}

## .bg-trans-dark {..bg-trans-dark}

rgba(0, 0, 0, 0.5)

----

## .bg-trans-light {..bg-trans-light}

rgba(255, 255, 255, 0.2)

:::

<slide class="bg-gradient-h">
# Gradients

:::flexblock {.border}

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

<slide class="bg-black" video="https://webslides.tv/static/videos/working.mp4 poster='https://webslides.tv/static/images/working.jpg'" >


`.background-video`

## **WebSlides is the easiest way to make HTML presentations. Inspire and engage.**

<slide class="bg-blue aligncenter" video="https://webslides.tv/static/videos/working.mp4 poster='https://webslides.tv/static/images/working.jpg' .dark">


## BG Video with Overlay {.text-landing}

`<slide class="bg-blue aligncenter" video="https://webslides.tv/static/videos/working.mp4 poster='https://webslides.tv/static/images/working.jpg' .dark">` or `.light`

<slide image="https://webslides.tv/static/images/iphone-hand.png .right-bottom">

:::{.content-left}
### .background-(position)

:::flexblock {.specs}
::fa-wifi::

## Ultra-Fast WiFi
Simple and secure file sharing.

---
::fa-battery-full::

## All day battery life
Your battery worries may be over.

---
::fa-life-ring::
## All day battery life
We'll fix it or if we can't, we'll replace it.

:::

<slide class="bg-black aligncenter" image="https://source.unsplash.com/UJbHNoVPZW0/ .dark">

# Iceland{.text-landing.text-shadow}

`slide[class*="bg-"] > .background.dark`

<slide class="bg-black aligncenter" image="https://source.unsplash.com/UJbHNoVPZW0/ .light">

# Iceland{.text-landing.text-shadow}

`slide[class*="bg-"] > .background.light`

<slide class="bg-black aligncenter" image="https://source.unsplash.com/n9WPPWiPPJw/ .anim">

## .background.anim



<slide class="aligncenter">

## **Flexible blocks**

`:::flexblock` = Flexible blocks with auto-fill and equal height.

---

:::flexblock
## :fa-bar-chart: Purpose
Businesses that people love1

---

## :fa-bar-chart: Purpose
Businesses that people love2

---

## :fa-balance-scale: Purpose
Businesses that people love3

---


## :fa-cog: Purpose
Businesses that people love4
:::

<slide>

## flexblock
:::flexblock
## :fa-bar-chart: Purpose
Businesses that people love1

---

## :fa-bar-chart: Purpose
Businesses that people love2

---

## :fa-balance-scale: Purpose
Businesses that people love3

---


## :fa-cog: Purpose
Businesses that people love4
:::


## flexblock

`{.blink.border}`

:::flexblock {.blink.border}
## :fa-bar-chart: Purpose
Businesses that people love5

---

## :fa-bar-chart: Purpose
Businesses that people love6

---

## :fa-balance-scale: Purpose
Businesses that people love7

---


## :fa-cog: Purpose
Businesses that people love8

:::

<slide>

## flexblock

`{.blink.border}`

:::flexblock {.blink.border}
## :fa-bar-chart: Purpose
Businesses that people love1

---

## :fa-bar-chart: Purpose
Businesses that people love2

---

## :fa-balance-scale: Purpose
Businesses that people love3

---


## :fa-cog: Purpose
Businesses that people love4

---

## :fa-bar-chart: Purpose
Businesses that people love5

---

## :fa-bar-chart: Purpose
Businesses that people love6

---

## :fa-balance-scale: Purpose
Businesses that people love7

---


## :fa-cog: Purpose
Businesses that people love8

:::


<slide>

## flexblock clients

`{.clients}`

:::flexblock {.clients}

![](https://webslides.tv/static/images/logos/google.svg){.blacklogo}
### Interfaces
Collaboration with the Acme team to design their mobile apps.

---
![](https://webslides.tv/static/images/logos/microsoft.svg) {.blacklogo}

### Interfaces
Collaboration with the Acme team to design their mobile apps.

---
![](https://webslides.tv/static/images/logos/instagram.svg){.blacklogo}

### Interfaces
Collaboration with the Acme team to design their mobile apps.

---
![](https://webslides.tv/static/images/logos/netflix.svg){.blacklogo}


### Interfaces
Collaboration with the Acme team to design their mobile apps.

:::

<slide>
## flexblock clients

`{.clients.border}`

:::flexblock {.clients.border}

![](https://webslides.tv/static/images/logos/google.svg){.blacklogo}
### Interfaces
Collaboration with the Acme team to design their mobile apps.

---
![](https://webslides.tv/static/images/logos/microsoft.svg) {.blacklogo}

### Interfaces
Collaboration with the Acme team to design their mobile apps.

---
![](https://webslides.tv/static/images/logos/instagram.svg){.blacklogo}

### Interfaces
Collaboration with the Acme team to design their mobile apps.

---
![](https://webslides.tv/static/images/logos/netflix.svg){.blacklogo}


### Interfaces
Collaboration with the Acme team to design their mobile apps.

:::

<slide>
### ul.flexblock.features

:::flexblock {.features}

## :100 ^%^:  customizable

 Well documented


 ----

:^$^48:
## EXTRA VIRGIN OLIVE OIL

The Spanish caviar.

----
## :fa-wifi: Ultra-fast Wifi

Simple file sharing.
:::

---

## ul.flexblock.features.blink

:::flexblock {.features.blink}

## :100 ^%^:  customizable

 Well documented


 ----

:^$^48:
## EXTRA VIRGIN OLIVE OIL

The Spanish caviar.

----
## :fa-wifi: Ultra-fast Wifi

Simple file sharing.
:::

---

<slide class="bg-green">

## flexblock .Metrics

:::flexblock {.border.metrics}

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

<slide :class="size-60">

### shadowbox

---

:::shadowbox

## We're web people.

There're excellent presentation tools out there. WebSlides is about telling the story, and sharing it in a beautiful way. Hypertext and clean code as narrative elements.

---

## Work better, faster.

Designers, marketers, and journalists can now focus on the content. Simply [choose a demo](https://webslides.tv/demos) and customize it in minutes.

:::

<slide>
## steps

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
### gallery

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
### gallery overlay

:::gallery-overlay

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


<slide class="bg-black-blue" :class="size-60">
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
