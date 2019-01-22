const mdIt = require('markdown-it')()
mdIt.use(require('./md-plugins/jsx'))
mdIt.use(require('./md-plugins/echarts'))
mdIt.use(require('markdown-it-sup'))
mdIt.use(require('markdown-it-attrs'))
mdIt.use(require('markdown-it-br'))

function getMdParser(plugins) {
  plugins.forEach(plugin => {
    mdIt.use(plugin)
  })
  return mdIt.render.bind(mdIt)
}

module.exports = getMdParser
