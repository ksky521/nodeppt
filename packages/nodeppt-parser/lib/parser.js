const posthtml = require('posthtml')
const posthtmlRender = require('posthtml-render')

const mdParser = require('./markdown-parser')
// 内置 posthtml 插件
const buildInPlugins = [
  './tags/slide.js',
  './tags/icon.js',
  './tags/note.js',
  './tags/flexblock.js',
  './plugins/attrs.js'
]
const plugins = buildInPlugins.map(file => {
  return require(file)
})

function parseMarkdown(str) {
  const slideTag = str.match(/<slide\s*(.*)>/gi) || []
  const contents = str.split(/<slide.*>/i)
  contents.shift()

  return contents
    .map((c, i) => {
      // 生成 attr
      const html = `
${slideTag[i]}
${mdParser(c)}
</slide>
      `
      // 生成 content ast
      return posthtml(plugins).process(html, {sync: true}).html
    })
    .join('\n')
}

module.exports = parseMarkdown
