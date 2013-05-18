/**
 * @authors Luke Mahe
 * @authors Eric Bidelman
 * @fileoverview TODO
 */
document.cancelFullScreen = document.webkitCancelFullScreen ||
                            document.mozCancelFullScreen;

/**
 * @constructor
 */
function SlideDeck(el) {
  this.curSlide_ = 0;
  this.prevSlide_ = 0;
  this.config_ = null;
  this.container = el || document.querySelector('slides');
  this.slides = [];
  this.controller = null;

  this.getCurrentSlideFromHash_();

  // Call this explicitly. Modernizr.load won't be done until after DOM load.
  this.onDomLoaded_.bind(this)();
}

/**
 * @const
 * @private
 */
SlideDeck.prototype.SLIDE_CLASSES_ = [
  'far-past', 'past', 'current', 'next', 'far-next'];

/**
 * @const
 * @private
 */
SlideDeck.prototype.CSS_DIR_ = 'theme/css/';

/**
 * @private
 */
SlideDeck.prototype.getCurrentSlideFromHash_ = function() {
  var slideNo = parseInt(document.location.hash.substr(1));

  if (slideNo) {
    this.curSlide_ = slideNo - 1;
  } else {
    this.curSlide_ = 0;
  }
};

/**
 * @param {number} slideNo
 */
SlideDeck.prototype.loadSlide = function(slideNo) {
  if (slideNo) {
    this.curSlide_ = slideNo - 1;
    this.updateSlides_();
  }
};

/**
 * @private
 */
SlideDeck.prototype.onDomLoaded_ = function(e) {
  document.body.classList.add('loaded'); // Add loaded class for templates to use.

  this.slides = this.container.querySelectorAll('slide:not([hidden]):not(.backdrop)');

  // If we're on a smartphone, apply special sauce.
  if (Modernizr.mq('only screen and (max-device-width: 480px)')) {
    // var style = document.createElement('link');
    // style.rel = 'stylesheet';
    // style.type = 'text/css';
    // style.href = this.CSS_DIR_ + 'phone.css';
    // document.querySelector('head').appendChild(style);

    // No need for widescreen layout on a phone.
    this.container.classList.remove('layout-widescreen');
  }

  this.loadConfig_(SLIDE_CONFIG);
  this.addEventListeners_();
  this.updateSlides_();

  // Add slide numbers and total slide count metadata to each slide.
  var that = this;
  for (var i = 0, slide; slide = this.slides[i]; ++i) {
    slide.dataset.slideNum = i + 1;
    slide.dataset.totalSlides = this.slides.length;

    slide.addEventListener('click', function(e) {
      if (document.body.classList.contains('overview')) {
        that.loadSlide(this.dataset.slideNum);
        e.preventDefault();
        window.setTimeout(function() {
          that.toggleOverview();
        }, 500);
      }
    }, false);
  }

  // Note: this needs to come after addEventListeners_(), which adds a
  // 'keydown' listener that this controller relies on.
  // Also, no need to set this up if we're on mobile.
  if (!Modernizr.touch) {
    this.controller = new SlideController(this);
    if (this.controller.isPopup) {
      document.body.classList.add('popup');
    }
  }
};

/**
 * @private
 */
SlideDeck.prototype.addEventListeners_ = function() {
  document.addEventListener('keydown', this.onBodyKeyDown_.bind(this), false);
  window.addEventListener('popstate', this.onPopState_.bind(this), false);

  // var transEndEventNames = {
  //   'WebkitTransition': 'webkitTransitionEnd',
  //   'MozTransition': 'transitionend',
  //   'OTransition': 'oTransitionEnd',
  //   'msTransition': 'MSTransitionEnd',
  //   'transition': 'transitionend'
  // };
  // 
  // // Find the correct transitionEnd vendor prefix.
  // window.transEndEventName = transEndEventNames[
  //     Modernizr.prefixed('transition')];
  // 
  // // When slides are done transitioning, kickoff loading iframes.
  // // Note: we're only looking at a single transition (on the slide). This
  // // doesn't include autobuilds the slides may have. Also, if the slide
  // // transitions on multiple properties (e.g. not just 'all'), this doesn't
  // // handle that case.
  // this.container.addEventListener(transEndEventName, function(e) {
  //     this.enableSlideFrames_(this.curSlide_);
  // }.bind(this), false);

  // document.addEventListener('slideenter', function(e) {
  //   var slide = e.target;
  //   window.setTimeout(function() {
  //     this.enableSlideFrames_(e.slideNumber);
  //     this.enableSlideFrames_(e.slideNumber + 1);
  //   }.bind(this), 300);
  // }.bind(this), false);
};

/**
 * @private
 * @param {Event} e The pop event.
 */
SlideDeck.prototype.onPopState_ = function(e) {
  if (e.state != null) {
    this.curSlide_ = e.state;
    this.updateSlides_(true);
  }
};

/**
 * @param {Event} e
 */
SlideDeck.prototype.onBodyKeyDown_ = function(e) {
  if (/^(input|textarea)$/i.test(e.target.nodeName) ||
      e.target.isContentEditable) {
    return;
  }

  // Forward keydowns to the main slides if we're the popup.
  if (this.controller && this.controller.isPopup) {
    this.controller.sendMsg({keyCode: e.keyCode});
  }

  switch (e.keyCode) {
    case 13: // Enter
      if (document.body.classList.contains('overview')) {
        this.toggleOverview();
      }
      break;

    case 39: // right arrow
    case 32: // space
    case 34: // PgDn
      this.nextSlide();
      e.preventDefault();
      break;

    case 37: // left arrow
    case 8: // Backspace
    case 33: // PgUp
      this.prevSlide();
      e.preventDefault();
      break;

    case 40: // down arrow
      this.nextSlide();
      e.preventDefault();
      break;

    case 38: // up arrow
      this.prevSlide();
      e.preventDefault();
      break;

    case 72: // H: Toggle code highlighting
      document.body.classList.toggle('highlight-code');
      break;

    case 79: // O: Toggle overview
      this.toggleOverview();
      break;

    case 80: // P
      if (this.controller && this.controller.isPopup) {
        document.body.classList.toggle('with-notes');
      } else if (this.controller && !this.controller.popup) {
        document.body.classList.toggle('with-notes');
      }
      break;

    case 82: // R
      // TODO: implement refresh on main slides when popup is refreshed.
      break;

    case 27: // ESC: Hide notes and highlighting
      document.body.classList.remove('with-notes');
      document.body.classList.remove('highlight-code');

      if (document.body.classList.contains('overview')) {
        this.toggleOverview();
      }
      break;

    case 70: // F: Toggle fullscreen
       // Only respect 'f' on body. Don't want to capture keys from an <input>.
       // Also, ignore browser's fullscreen shortcut (cmd+shift+f) so we don't
       // get trapped in fullscreen!
      if (e.target == document.body && !(e.shiftKey && e.metaKey)) {
        if (document.mozFullScreen !== undefined && !document.mozFullScreen) {
          document.body.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen) {
          document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
          document.cancelFullScreen();
        }
      }
      break;

    case 87: // W: Toggle widescreen
      // Only respect 'w' on body. Don't want to capture keys from an <input>.
      if (e.target == document.body && !(e.shiftKey && e.metaKey)) {
        this.container.classList.toggle('layout-widescreen');
      }
      break;
  }
};

/**
 *
 */
SlideDeck.prototype.focusOverview_ = function() {
  var overview = document.body.classList.contains('overview');

  for (var i = 0, slide; slide = this.slides[i]; i++) {
    slide.style[Modernizr.prefixed('transform')] = overview ?
        'translateZ(-2500px) translate(' + (( i - this.curSlide_ ) * 105) +
                                       '%, 0%)' : '';
  }
};

/**
 */
SlideDeck.prototype.toggleOverview = function() {
  document.body.classList.toggle('overview');

  this.focusOverview_();
};

/**
 * @private
 */
SlideDeck.prototype.loadConfig_ = function(config) {
  if (!config) {
    return;
  }

  this.config_ = config;

  var settings = this.config_.settings;

  this.loadTheme_(settings.theme || []);

  if (settings.favIcon) {
    this.addFavIcon_(settings.favIcon);
  }

  // Prettyprint. Default to on.
  if (!!!('usePrettify' in settings) || settings.usePrettify) {
    prettyPrint();
  }

  if (settings.analytics) {
    this.loadAnalytics_();
  }

  if (settings.fonts) {
    this.addFonts_(settings.fonts);
  }

  // Builds. Default to on.
  if (!!!('useBuilds' in settings) || settings.useBuilds) {
    this.makeBuildLists_();
  }

  if (settings.title) {
    document.title = settings.title.replace(/<br\/?>/, ' ');
    if (settings.eventTitle) {
      document.title +=  ' - ' + settings.eventTitle;
    }
    document.querySelector('[data-config-title]').innerHTML = settings.title;
  }

  if (settings.subtitle) {
    document.querySelector('[data-config-subtitle]').innerHTML = settings.subtitle;
  }

  if (this.config_.presenters) {
    var presenters = this.config_.presenters;
    var dataConfigContact = document.querySelector('[data-config-contact]');

    var html = [];
    if (presenters.length == 1) {
      var p = presenters[0];

      html = [p.name, p.company].join('<br>');

      var gplus = p.gplus ? '<span>g+</span><a href="' + p.gplus +
          '">' + p.gplus.replace(/https?:\/\//, '') + '</a>' : '';

      var twitter = p.twitter ? '<span>twitter</span>' +
          '<a href="http://twitter.com/' + p.twitter + '">' +
          p.twitter + '</a>' : '';

      var www = p.www ? '<span>www</span><a href="' + p.www +
                        '">' + p.www.replace(/https?:\/\//, '') + '</a>' : '';

      var github = p.github ? '<span>github</span><a href="' + p.github +
          '">' + p.github.replace(/https?:\/\//, '') + '</a>' : '';

      var html2 = [gplus, twitter, www, github].join('<br>');

      if (dataConfigContact) {
        dataConfigContact.innerHTML = html2;
      }
    } else {
      for (var i = 0, p; p = presenters[i]; ++i) {
        html.push(p.name + ' - ' + p.company);
      }
      html = html.join('<br>');
      if (dataConfigContact) {
        dataConfigContact.innerHTML = html;
      }
    }

    var dataConfigPresenter = document.querySelector('[data-config-presenter]');
    if (dataConfigPresenter) {
      dataConfigPresenter.innerHTML = html;
      if (settings.eventTitle) {
        dataConfigPresenter.innerHTML = dataConfigPresenter.innerHTML + '<br>' +
                                        settings.eventTitle;
      }
    }
  }

  /* Left/Right tap areas. Default to including. */
  if (!!!('enableSlideAreas' in settings) || settings.enableSlideAreas) {
    var el = document.createElement('div');
    el.classList.add('slide-area');
    el.id = 'prev-slide-area';
    el.addEventListener('click', this.prevSlide.bind(this), false);
    this.container.appendChild(el);

    var el = document.createElement('div');
    el.classList.add('slide-area');
    el.id = 'next-slide-area';
    el.addEventListener('click', this.nextSlide.bind(this), false);
    this.container.appendChild(el);
  }

  if (Modernizr.touch && (!!!('enableTouch' in settings) ||
      settings.enableTouch)) {
    var self = this;

    // Note: this prevents mobile zoom in/out but prevents iOS from doing
    // it's crazy scroll over effect and disaligning the slides.
    window.addEventListener('touchstart', function(e) {
      e.preventDefault();
    }, false);

    var hammer = new Hammer(this.container);
    hammer.ondragend = function(e) {
      if (e.direction == 'right' || e.direction == 'down') {
        self.prevSlide();
      } else if (e.direction == 'left' || e.direction == 'up') {
        self.nextSlide();
      }
    };
  }
};

/**
 * @private
 * @param {Array.<string>} fonts
 */
SlideDeck.prototype.addFonts_ = function(fonts) {
  var el = document.createElement('link');
  el.rel = 'stylesheet';
  el.href = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://fonts.googleapis.com/css?family=' + fonts.join('|') + '&v2';
  document.querySelector('head').appendChild(el);
};

/**
 * @private
 */
SlideDeck.prototype.buildNextItem_ = function() {
  var slide = this.slides[this.curSlide_];
  var toBuild = slide.querySelector('.to-build');
  var built = slide.querySelector('.build-current');

  if (built) {
    built.classList.remove('build-current');
    if (built.classList.contains('fade')) {
      built.classList.add('build-fade');
    }
  }

  if (!toBuild) {
    var items = slide.querySelectorAll('.build-fade');
    for (var j = 0, item; item = items[j]; j++) {
      item.classList.remove('build-fade');
    }
    return false;
  }

  toBuild.classList.remove('to-build');
  toBuild.classList.add('build-current');

  return true;
};

/**
 * @param {boolean=} opt_dontPush
 */
SlideDeck.prototype.prevSlide = function(opt_dontPush) {
  if (this.curSlide_ > 0) {
    var bodyClassList = document.body.classList;
    bodyClassList.remove('highlight-code');

    // Toggle off speaker notes if they're showing when we move backwards on the
    // main slides. If we're the speaker notes popup, leave them up.
    if (this.controller && !this.controller.isPopup) {
      bodyClassList.remove('with-notes');
    } else if (!this.controller) {
      bodyClassList.remove('with-notes');
    }

    this.prevSlide_ = this.curSlide_--;

    this.updateSlides_(opt_dontPush);
  }
};

/**
 * @param {boolean=} opt_dontPush
 */
SlideDeck.prototype.nextSlide = function(opt_dontPush) {
  if (!document.body.classList.contains('overview') && this.buildNextItem_()) {
    return;
  }

  if (this.curSlide_ < this.slides.length - 1) {
    var bodyClassList = document.body.classList;
    bodyClassList.remove('highlight-code');

    // Toggle off speaker notes if they're showing when we advanced on the main
    // slides. If we're the speaker notes popup, leave them up.
    if (this.controller && !this.controller.isPopup) {
      bodyClassList.remove('with-notes');
    } else if (!this.controller) {
      bodyClassList.remove('with-notes');
    }

    this.prevSlide_ = this.curSlide_++;

    this.updateSlides_(opt_dontPush);
  }
};

/* Slide events */

/**
 * Triggered when a slide enter/leave event should be dispatched.
 *
 * @param {string} type The type of event to trigger
 *     (e.g. 'slideenter', 'slideleave').
 * @param {number} slideNo The index of the slide that is being left.
 */
SlideDeck.prototype.triggerSlideEvent = function(type, slideNo) {
  var el = this.getSlideEl_(slideNo);
  if (!el) {
    return;
  }

  // Call onslideenter/onslideleave if the attribute is defined on this slide.
  var func = el.getAttribute(type);
  if (func) {
    new Function(func).call(el); // TODO: Don't use new Function() :(
  }

  // Dispatch event to listeners setup using addEventListener.
  var evt = document.createEvent('Event');
  evt.initEvent(type, true, true);
  evt.slideNumber = slideNo + 1; // Make it readable
  evt.slide = el;

  el.dispatchEvent(evt);
};

/**
 * @private
 */
SlideDeck.prototype.updateSlides_ = function(opt_dontPush) {
  var dontPush = opt_dontPush || false;

  var curSlide = this.curSlide_;
  for (var i = 0; i < this.slides.length; ++i) {
    switch (i) {
      case curSlide - 2:
        this.updateSlideClass_(i, 'far-past');
        break;
      case curSlide - 1:
        this.updateSlideClass_(i, 'past');
        break;
      case curSlide:
        this.updateSlideClass_(i, 'current');
        break;
      case curSlide + 1:
        this.updateSlideClass_(i, 'next');
        break;
      case curSlide + 2:
        this.updateSlideClass_(i, 'far-next');
        break;
      default:
        this.updateSlideClass_(i);
        break;
    }
  };

  this.triggerSlideEvent('slideleave', this.prevSlide_);
  this.triggerSlideEvent('slideenter', curSlide);

// window.setTimeout(this.disableSlideFrames_.bind(this, curSlide - 2), 301);
// 
// this.enableSlideFrames_(curSlide - 1); // Previous slide.
// this.enableSlideFrames_(curSlide + 1); // Current slide.
// this.enableSlideFrames_(curSlide + 2); // Next slide.

   // Enable current slide's iframes (needed for page loat at current slide).
   this.enableSlideFrames_(curSlide + 1);

   // No way to tell when all slide transitions + auto builds are done.
   // Give ourselves a good buffer to preload the next slide's iframes.
   window.setTimeout(this.enableSlideFrames_.bind(this, curSlide + 2), 1000);

  this.updateHash_(dontPush);

  if (document.body.classList.contains('overview')) {
    this.focusOverview_();
    return;
  }

};

/**
 * @private
 * @param {number} slideNo
 */
SlideDeck.prototype.enableSlideFrames_ = function(slideNo) {
  var el = this.slides[slideNo - 1];
  if (!el) {
    return;
  }

  var frames = el.querySelectorAll('iframe');
  for (var i = 0, frame; frame = frames[i]; i++) {
    this.enableFrame_(frame);
  }
};

/**
 * @private
 * @param {number} slideNo
 */
SlideDeck.prototype.enableFrame_ = function(frame) {
  var src = frame.dataset.src;
  if (src && frame.src != src) {
    frame.src = src;
  }
};

/**
 * @private
 * @param {number} slideNo
 */
SlideDeck.prototype.disableSlideFrames_ = function(slideNo) {
  var el = this.slides[slideNo - 1];
  if (!el) {
    return;
  }

  var frames = el.querySelectorAll('iframe');
  for (var i = 0, frame; frame = frames[i]; i++) {
    this.disableFrame_(frame);
  }
};

/**
 * @private
 * @param {Node} frame
 */
SlideDeck.prototype.disableFrame_ = function(frame) {
  frame.src = 'about:blank';
};

/**
 * @private
 * @param {number} slideNo
 */
SlideDeck.prototype.getSlideEl_ = function(no) {
  if ((no < 0) || (no >= this.slides.length)) {
    return null;
  } else {
    return this.slides[no];
  }
};

/**
 * @private
 * @param {number} slideNo
 * @param {string} className
 */
SlideDeck.prototype.updateSlideClass_ = function(slideNo, className) {
  var el = this.getSlideEl_(slideNo);

  if (!el) {
    return;
  }

  if (className) {
    el.classList.add(className);
  }

  for (var i = 0, slideClass; slideClass = this.SLIDE_CLASSES_[i]; ++i) {
    if (className != slideClass) {
      el.classList.remove(slideClass);
    }
  }
};

/**
 * @private
 */
SlideDeck.prototype.makeBuildLists_ = function () {
  for (var i = this.curSlide_, slide; slide = this.slides[i]; ++i) {
    var items = slide.querySelectorAll('.build > *');
    for (var j = 0, item; item = items[j]; ++j) {
      if (item.classList) {
        item.classList.add('to-build');
        if (item.parentNode.classList.contains('fade')) {
          item.classList.add('fade');
        }
      }
    }
  }
};

/**
 * @private
 * @param {boolean} dontPush
 */
SlideDeck.prototype.updateHash_ = function(dontPush) {
  if (!dontPush) {
    var slideNo = this.curSlide_ + 1;
    var hash = '#' + slideNo;
    if (window.history.pushState) {
      window.history.pushState(this.curSlide_, 'Slide ' + slideNo, hash);
    } else {
      window.location.replace(hash);
    }

    // Record GA hit on this slide.
    window['_gaq'] && window['_gaq'].push(['_trackPageview',
                                          document.location.href]);
  }
};


/**
 * @private
 * @param {string} favIcon
 */
SlideDeck.prototype.addFavIcon_ = function(favIcon) {
  var el = document.createElement('link');
  el.rel = 'icon';
  el.type = 'image/png';
  el.href = favIcon;
  document.querySelector('head').appendChild(el);
};

/**
 * @private
 * @param {string} theme
 */
SlideDeck.prototype.loadTheme_ = function(theme) {
  var styles = [];
  if (theme.constructor.name === 'String') {
    styles.push(theme);
  } else {
    styles = theme;
  }

  for (var i = 0, style; themeUrl = styles[i]; i++) {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    if (themeUrl.indexOf('http') == -1) {
      style.href = this.CSS_DIR_ + themeUrl + '.css';
    } else {
      style.href = themeUrl;
    }
    document.querySelector('head').appendChild(style);
  }
};

/**
 * @private
 */
SlideDeck.prototype.loadAnalytics_ = function() {
  var _gaq = window['_gaq'] || [];
  _gaq.push(['_setAccount', this.config_.settings.analytics]);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
};


// Polyfill missing APIs (if we need to), then create the slide deck.
// iOS < 5 needs classList, dataset, and window.matchMedia. Modernizr contains
// the last one.
(function() {
  Modernizr.load({
    test: !!document.body.classList && !!document.body.dataset,
    nope: ['js/polyfills/classList.min.js', 'js/polyfills/dataset.min.js'],
    complete: function() {
      window.slidedeck = new SlideDeck();
    }
  });
})();
