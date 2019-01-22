const posthtmlParser = require('posthtml-parser')
const {mergeAttrs} = require('../utils')

module.exports = str => {
  str = str.replace(/^\s*\[/, '<').replace(/]\s*$/, '>')
  const ast = posthtmlParser(str)[0]
  ast.tag = 'section'
  ast.attrs = mergeAttrs(
    {
      class: 'slide'
    },
    ast.attrs
  )
  return ast
}
