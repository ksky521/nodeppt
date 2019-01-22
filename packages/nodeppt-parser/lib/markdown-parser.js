const mdIt = require('markdown-it')()
const mdJsx = require('markdown-it-jsx')
mdIt.use(mdJsx)

function getMdParser(str) {
  return mdIt.render(str)
}

module.exports = getMdParser
