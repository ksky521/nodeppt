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
        case 'features':
          cls.push('features')
          break
        case 'border':
          cls.push('border blink')
          break
      }
    }
    node.attrs = mergeAttrs({class: cls.join(' ')}, node.attrs)

    const content = node.content
    if (Array.isArray(content)) {
      const rs = []
      let tmpIndex = 0
      let steps = 0
      for (let i = 0; i < content.length; i++) {
        const tag = content[i]
        if (tag && tag.tag === 'hr') {
          rs.push({
            tag: 'li',
            content: getChild(
              [
                isSteps && steps >= 1
                  ? {
                      tag: 'div',
                      attrs: {
                        class: `process step-${steps + 1}`
                      }
                    }
                  : '',
                ...content.slice(tmpIndex, i - 1)
              ],
              node.attrs.type
            )
          })
          steps++
          tmpIndex = i + 1
        }
      }
      rs.push({
        tag: 'li',
        content: getChild(
          [
            isSteps && steps >= 1
              ? {
                  tag: 'div',
                  attrs: {
                    class: `process step-${steps + 1}`
                  }
                }
              : '',
            ...content.slice(tmpIndex)
          ],
          node.attrs.type
        )
      })
      node.content = rs
    }
    return node
  })
}

function getChild(content, type) {
  switch (type) {
    case 'features':
      return {
        tag: 'div',
        content
      }
    case 'border':
      return {
        tag: 'a',
        content: [
          {
            tag: 'div',
            content
          }
        ]
      }
    default:
      return content
  }
}
