const posthtml = require('posthtml')
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

function parseMarkdown(str, ps = []) {
  const markdownPlugins = []
  const posthtmlPlugins = []

  ps.forEach(p => {
    if (p && typeof p.apply === 'function') {
      if (p.id.indexOf('markdown') === 0) {
        markdownPlugins.push(p.apply)
      } else if (p.id.indexOf('posthtml') === 0) {
        posthtmlPlugins.push(p.apply)
      }
    }
  })
  const mdRender = mdParser(markdownPlugins)

  const slideTag = str.match(/<slide\s*(.*)>/gi) || []
  const contents = str.split(/<slide.*>/i)
  contents.shift()

  return contents
    .map((c, i) => {
      // 生成 attr
      const html = `
${slideTag[i]}
${mdRender(c)}
</slide>
      `
      // 生成 content ast
      return posthtml(plugins.concat(posthtmlPlugins)).process(html, {sync: true}).html
    })
    .join('\n')
}

module.exports = parseMarkdown
