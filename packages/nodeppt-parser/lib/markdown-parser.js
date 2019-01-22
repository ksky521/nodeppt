const mdIt = require('markdown-it')()
const mdJsx = require('markdown-it-jsx')
mdIt.use(mdJsx)

function getMdParser(plugins) {
  plugins.forEach(plugin => {
    mdIt.use(plugin)
  })
  return mdIt.render
}

module.exports = getMdParser
