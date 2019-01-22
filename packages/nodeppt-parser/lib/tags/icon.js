const {mergeAttrs} = require('../utils')

module.exports = tree => {
  tree.match({tag: 'icon'}, node => {
    node.tag = 'i'
    node.attrs = mergeAttrs({class: 'icon'}, node.attrs || {})
    return node
  })
}
