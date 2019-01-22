const utils = require('./utils')
module.exports = tree => {
  const {slideNode, wrapNode} = utils(tree)
  let footer = ''
  tree.match({tag: 'footer'}, node => {
    node.tag = 'footer'
    node.content = [
      {
        tag: 'div',
        attrs: {
          class: 'wrap'
        },
        content: node.content
      }
    ]
    footer = node
    return ''
  })
  slideNode.content.push(footer)

}
