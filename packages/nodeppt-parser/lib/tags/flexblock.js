const {mergeAttrs} = require('../utils')

module.exports = tree => {
  tree.match({tag: 'flexblock'}, node => {
    node.tag = 'ul'
    let isSteps = false
    const cls = ['flexblock']
    if (node.attrs) {
      switch (node.attrs.type) {
        case 'steps':
          isSteps = true
          cls.push('steps')
          break
      }
    }
    node.attrs = mergeAttrs({class: cls.join(' ')}, node.attrs)

    const content = node.content
    const rs = []
    let tmpIndex = 0
    let steps = 0
    for (let i = 0; i < content.length; i++) {
      const tag = content[i]
      if (tag && tag.tag === 'hr') {
        rs.push({
          tag: 'li',
          content: [
            isSteps && steps >= 1
              ? {
                  tag: 'div',
                  attrs: {
                    class: `process step-${steps + 1}`
                  }
                }
              : '',
            ...content.slice(tmpIndex, i - 1)
          ]
        })
        steps++
        tmpIndex = i + 1
      }
    }
    rs.push({
      tag: 'li',
      content: [
        isSteps && steps >= 1
          ? {
              tag: 'div',
              attrs: {
                class: `process step-${steps + 1}`
              }
            }
          : '',
        ...content.slice(tmpIndex)
      ]
    })
    node.content = rs
    return node
  })
}
