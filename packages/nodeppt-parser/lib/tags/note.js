const {mergeAttrs} = require('../utils')

module.exports = tree => {
  tree.match({tag: 'note'}, node => {
    node.tag = 'div'
    node.attrs = mergeAttrs({class: 'note'}, node.attrs)
    return node
  })
}
