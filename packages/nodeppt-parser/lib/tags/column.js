const {mergeAttrs} = require('../utils')

module.exports = tree => {
  tree.match({tag: 'column'}, node => {
    node.tag = 'div'
    node.attrs = mergeAttrs({class: 'grid'}, node.attrs)

    const content = node.content
    const rs = []
    let tmpIndex = 0
    for (let i = 0; i < content.length; i++) {
      const tag = content[i]
      if (tag && tag.tag === 'hr') {
        rs.push({
          tag: 'div',
          attrs: {
            class: 'column'
          },
          content: content.slice(tmpIndex, i - 1)
        })
        tmpIndex = i + 1
      }
    }
    rs.push({
      tag: 'div',
      attrs: {
        class: 'column'
      },
      content: content.slice(tmpIndex)
    })
    node.content = rs
    return node
  })
}
