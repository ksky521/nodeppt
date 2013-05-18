(function(window) {

var ORIGIN_ = location.protocol + '//' + location.host;

function SlideController() {
  this.popup = null;
  this.isPopup = window.opener;

  if (this.setupDone()) {
    window.addEventListener('message', this.onMessage_.bind(this), false);

    // Close popups if we reload the main window.
    window.addEventListener('beforeunload', function(e) {
      if (this.popup) {
        this.popup.close();
      }
    }.bind(this), false);
  }
}

SlideController.PRESENTER_MODE_PARAM = 'presentme';

SlideController.prototype.setupDone = function() {
  var params = location.search.substring(1).split('&').map(function(el) {
    return el.split('=');
  });

  var presentMe = null;
  for (var i = 0, param; param = params[i]; ++i) {
    if (param[0].toLowerCase() == SlideController.PRESENTER_MODE_PARAM) {
      presentMe = param[1] == 'true';
      break;
    }
  }

  if (presentMe !== null) {
    localStorage.ENABLE_PRESENTOR_MODE = presentMe;
    // TODO: use window.history.pushState to update URL instead of the redirect.
    if (window.history.replaceState) {
      window.history.replaceState({}, '', location.pathname);
    } else {
      location.replace(location.pathname);
      return false;
    }
  }

  var enablePresenterMode = localStorage.getItem('ENABLE_PRESENTOR_MODE');
  if (enablePresenterMode && JSON.parse(enablePresenterMode)) {
    // Only open popup from main deck. Don't want recursive popup opening!
    if (!this.isPopup) {
      var opts = 'menubar=no,location=yes,resizable=yes,scrollbars=no,status=no';
      this.popup = window.open(location.href, 'mywindow', opts);

      // Loading in the popup? Trigger the hotkey for turning presenter mode on.
      this.popup.addEventListener('load', function(e) {
        var evt = this.popup.document.createEvent('Event');
        evt.initEvent('keydown', true, true);
        evt.keyCode = 'P'.charCodeAt(0);
        this.popup.document.dispatchEvent(evt);
        // this.popup.document.body.classList.add('with-notes');
        // document.body.classList.add('popup');
      }.bind(this), false);
    }
  }

  return true;
}

SlideController.prototype.onMessage_ = function(e) {
  var data = e.data;

  // Restrict messages to being from this origin. Allow local developmet
  // from file:// though.
  // TODO: It would be dope if FF implemented location.origin!
  if (e.origin != ORIGIN_ && ORIGIN_.indexOf('file://') != 0) {
    alert('Someone tried to postMessage from an unknown origin');
    return;
  }

  // if (e.source.location.hostname != 'localhost') {
  //   alert('Someone tried to postMessage from an unknown origin');
  //   return;
  // }

  if ('keyCode' in data) {
    var evt = document.createEvent('Event');
    evt.initEvent('keydown', true, true);
    evt.keyCode = data.keyCode;
    document.dispatchEvent(evt);
  }
};

SlideController.prototype.sendMsg = function(msg) {
  // // Send message to popup window.
  // if (this.popup) {
  //   this.popup.postMessage(msg, ORIGIN_);
  // }

  // Send message to main window.
  if (this.isPopup) {
    // TODO: It would be dope if FF implemented location.origin.
    window.opener.postMessage(msg, '*');
  }
};

window.SlideController = SlideController;

})(window);

