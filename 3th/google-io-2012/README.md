<style>
@import "http://fonts.googleapis.com/css?family=Open Sans:regular,semibold,italic,italicsemibold|Inconsolata&amp;v2";
body {
  font-family: "Open Sans";
  margin: 6em 2em 2em 2em;
}
body:before {
  content: '';
  position: fixed;
  top: 2%;
  right: 3%;
  height: 100px;
  width: 100px;
  background: url(http://www.html5rocks.com/static/images/identity/HTML5_Badge_128.png) no-repeat 50% 50%;
  background-size: contain;
  z-index: 10;
  opacity: 0.1;
}
h1, h2, h3, h4 {
  font-weight: 600;
}
h1 {
  position: fixed;
  background: -webkit-linear-gradient(top, white 65%, rgba(255,255,255,0));
  background: -moz-linear-gradient(top, white 65%, rgba(255,255,255,0));
  background: -ms-linear-gradient(top, white 65%, rgba(255,255,255,0));
  background: -o-linear-gradient(top, white 65%, rgba(255,255,255,0));
  width: 100%;
  height: 80px;
  padding: 10px 10px 10px 1em;
  left: 0;
  top: 0;
  margin: 0;
}
h1 img {
  height: 30px;
  vertical-align: middle;
  margin-bottom: 8px;
}
a { color: navy; }
pre {
  background: #eee;
  margin-left: 2em;
  padding: 5px;
  border-left: 3px solid #ccc;
}
</style>

<h1><img src="images/io2012_logo.png"> HTML5 Slide Template</h1>

## Configuring the slides

Much of the deck is customized by changing the settings in [`slide_config.js`](slide_config.js).
Some of the customizations include the title, Analytics tracking ID, speaker
information (name, social urls, blog), web fonts to load, themes, and other
general behavior.

### Customizing the `#io12` hash

The bottom of the slides include `#io12` by default. If you'd like to change
this, please update the variable `$social-tags: '#io12';` in
[`/theme/scss/default.scss`](theme/scss/default.scss).

See the next section on "Editing CSS" before you go editing things.

## Editing CSS

[Compass](http://compass-style.org/install/) is a CSS preprocessor used to compile
SCSS/SASS into CSS. We chose SCSS for the new slide deck for maintainability,
easier browser compatibility, and because...it's the future!

That said, if not comfortable working with SCSS or don't want to learn something
new, not a problem. The generated .css files can already be found in
(see [`/theme/css`](theme/css)). You can just edit those and bypass SCSS altogether.
However, our recommendation is to use Compass. It's super easy to install and use.

### Installing Compass and making changes

First, install compass:

    sudo gem update --system
    sudo gem install compass

Next, you'll want to watch for changes to the exiting .scss files in [`/theme/scss`](theme/scss)
and any new one you add:

    $ cd io-2012-slides
    $ compass watch

This command automatically recompiles the .scss file when you make a change.
Its corresponding .css file is output to [`/theme/css`](theme/css). Slick.

By default, [`config.rb`](config.rb) in the main project folder outputs minified
.css. It's a best practice after all! However, if you want unminified files,
run watch with the style output flag:

    compass watch -s expanded

*Note:* You should not need to edit [`_base.scss`](theme/scss/_base.scss).

## Running the slides

The slides can be run locally from `file://` making development easy :)

### Running from a web server

If at some point you should need a web server, use [`serve.sh`](serve.sh). It will
launch a simple one and point your default browser to [`http://localhost:8000/template.html`](http://localhost:8000/template.html):

    $ cd io-2012-slides
    $ ./serve.sh

You can also specify a custom port:

    $ ./serve.sh 8080

### Presenter mode

The slides contain a presenter mode feature (beta) to view + control the slides
from a popup window.

To enable presenter mode, add `presentme=true` to the URL: [http://localhost:8000/template.html?presentme=true](http://localhost:8000/template.html?presentme=true)

To disable presenter mode, hit [http://localhost:8000/template.html?presentme=false](http://localhost:8000/template.html?presentme=false)

Presenter mode is sticky, so refreshing the page will persist your settings.

---

That's all she wrote!
