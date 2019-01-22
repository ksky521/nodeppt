const posthtmlParser = require('posthtml-parser')
const {mergeAttrs} = require('../utils')

module.exports = tree => {
  const walk = tree.walk
  tree.walk(node => {
    if (
      node &&
      node.tag &&
      node.content &&
      node.content.find(child => {
        if (child.tag) {
          return true
        }
        return false
      })
    ) {
      const parentNode = node
      // 说明是有子节点的父节点
      // 查找三层数据，用于处理::: / :: 语法
      walk.call(parentNode, childNode => {
        if (childNode.tag && childNode.content) {
          walk.call(childNode, text => {
            const rs = getAttrFromTextNode(text)
            if (rs && rs.attrs) {
              const node = rs.node === 'parent' ? parentNode : childNode
              node.attrs = mergeAttrs(rs.attrs, node.attrs || {})
              return rs.content
            }
            return text
          })
        }
        return childNode
      })
    }

    return node
  })
}

/**
 * 判断是不是个文本节点，并且存在 ::: / :: 语法
 * @param {Node} node - node节点
 */
function getAttrFromTextNode(node) {
  if (node && typeof node === 'string') {
    const m = node.match(/\s+:{2,3}(.+?)$/)
    if (m && m[1]) {
      const attrs = m[1].split(/\s+/).map(attr => {
        attr = String(attr).trim()
        // 处理 .className 这类
        if (/^\./.test(attr)) {
          // .className1.className2
          return `class="${attr
            .split('.')
            .join(' ')
            .trim()}"`
        } else if (/^\#/.test(attr)) {
          // id 只有一个，所以不存在多余的情况
          return `id="${attr.slice(1)}"`
        }
        return attr
      })
      const html = `<fake ${attrs.join(' ')}></fake>`
      return {
        content: node.replace(m[0], ''),
        node: m[0].trim().slice(0, 3) === ':::' ? 'parent' : 'child',
        attrs: posthtmlParser(html)[0].attrs
      }
    }
  }
  return false
}
