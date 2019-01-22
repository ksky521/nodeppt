const {mergeAttrs} = require('../utils')

module.exports = tree => {
  tree.match({tag: 'slide'}, node => {
    node.tag = 'section'
    node.attrs = mergeAttrs(
      {
        class: 'slide'
      },
      node.attrs
    )
    return node
  })
}
