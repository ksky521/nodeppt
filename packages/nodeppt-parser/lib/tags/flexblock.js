const {mergeAttrs} = require('../utils')

module.exports = tree => {
  tree.match({tag: 'flexblock'}, node => {
    node.tag = 'ul'
    node.attrs = mergeAttrs({class: 'flexblock'}, node.attrs)
    node.content = node.content.filter(c => c.tag === 'ul' && c.content.length).map(({content}) => content)
    return node
  })
}
