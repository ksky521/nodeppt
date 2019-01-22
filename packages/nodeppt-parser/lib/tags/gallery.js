const {mergeAttrs} = require('../utils')

module.exports = tree => {
  tree.match({tag: 'gallery'}, node => {
    console.log(node.content)
    node.tag = 'ul'
    // 是否是 overlay
    let isOverlay = false
    const cls = ['flexblock', 'gallery']
    if (node.attrs) {
      switch (node.attrs.type) {
        case 'overlay':
          isOverlay = true
          break
      }
    }
    node.attrs = mergeAttrs({class: cls.join(' ')}, node.attrs)

    const content = node.content
    const rs = []
    let tmpIndex = 0

    for (let i = 0; i < content.length; i++) {
      const tag = content[i]
      if (tag && tag.tag === 'hr') {
        const {img, ctx} = getImageContent(content.slice(tmpIndex, i - 1))
        rs.push({
          tag: 'li',
          content: [
            {
              tag: 'a',
              attrs: {href: '#'},
              content: [
                {
                  tag: 'figure',
                  content: [
                    img,
                    isOverlay
                      ? {
                          tag: 'div',
                          attrs: {class: 'overlay'},
                          content: ctx
                        }
                      : {
                          tag: 'figcaption',
                          content: ctx
                        }
                  ]
                }
              ]
            }
          ]
        })
        tmpIndex = i + 1
      }
    }
    const {img, ctx} = getImageContent(content.slice(tmpIndex))

    rs.push({
      tag: 'li',
      content: [
        {
          tag: 'a',
          attrs: {href: '#'},
          content: [
            {
              tag: 'figure',
              content: [
                img,
                isOverlay
                  ? {
                      tag: 'div',
                      attrs: {class: 'overlay'},
                      content: ctx
                    }
                  : {
                      tag: 'figcaption',
                      content: ctx
                    }
              ]
            }
          ]
        }
      ]
    })
    node.content = rs
    return node
  })
}

function getImageContent(content) {
  let img,
    ctx = []
  content.forEach(i => {
    if (i.tag === 'p' && i.content) {
      const tmp = i.content.find(n => n.tag === 'img')
      if (tmp) {
        img = tmp
      }else{
        ctx.push(i)
      }
    } else {
      ctx.push(i)
    }
  })
  return {
    img,
    ctx
  }
}
