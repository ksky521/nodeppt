/**
 * 页面的 main.js
 */
import Slide from 'nodeppt-js'

window.WebSlide = Slide

if (module.hot) {
  var hotEmitter = require('webpack/hot/emitter')
  hotEmitter.on('webpackHotUpdate', function(currentHash) {
    location.reload()
  })
} else {
  throw new Error('[HMR] Hot Module Replacement is disabled.')
}
