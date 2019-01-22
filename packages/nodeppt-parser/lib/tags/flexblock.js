const {mergeAttrs} = require('../utils')

module.exports = tree => {
  tree.match({tag: 'flexblock'}, node => {
    node.tag = 'ul'
    node.attrs = mergeAttrs({class: 'flexblock'}, node.attrs)

    const content = node.content
    const rs = []
    let tmpIndex = 0
    for (let i = 0; i < content.length; i++) {
      const tag = content[i]
      if (tag && tag.tag === 'hr') {
        rs.push({
          tag: 'li',
          content: content.slice(tmpIndex, i - 1)
        })
        tmpIndex = i + 1
      }
    }
    rs.push({
      tag: 'li',
      content: content.slice(tmpIndex)
    })
    node.content = rs
    return node
  })
}
