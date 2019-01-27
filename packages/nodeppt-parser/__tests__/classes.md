
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
