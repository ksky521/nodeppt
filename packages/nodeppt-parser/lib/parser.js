const path = require('path')

const ejs = require('ejs')
const posthtml = require('posthtml')
const posthtmlRender = require('posthtml-render')

const fs = require('fs-extra')
const defaultDeep = require('lodash.defaultsdeep')
// parsers
const yamlParser = require('./yaml-parser')
const mdParser = require('./markdown-parser')
const getSlide = require('./tags/slide')

const {mergeAttrs} = require('./utils')

// 模板
const template = fs.readFileSync(path.join(__dirname, '../template/index.ejs')).toString()

// 内置 posthtml 插件
const buildInPlugins = ['./tags/icon.js', './tags/note.js', './tags/flexblock.js', './plugins/attrs.js']
const plugins = buildInPlugins.map(file => {
  return require(file)
})
const defaults = {
  title: 'nodeppt markdown',
  url: '',
  speaker: '',
  js: '',
  theme: 'moon',
  transition: 'move',
  highlightStyle: 'monokai_sublime',
  date: Date.now()
}
function parseMarkdown(str) {
  let splitReg = /\[slide\s*(.*)]/gi
  const slidesSettings = str.match(splitReg) || []
  let contents = str.split(/\[slide.*]/i)

  // 首部 yaml 设置部分
  const globalSettings = defaultDeep(yamlParser(contents.shift()), defaults)

  contents = contents.map((c, i) => {
    // 生成 attr
    let slideNode = getSlide(slidesSettings[i])
    // 生成 content ast
    slideNode.content = posthtml(plugins).process(mdParser(c), {sync: true}).tree

    return posthtmlRender(slideNode)
  })
  return ejs.render(template, {...globalSettings, content: contents.join('\n')})
}

function parseAttrs(str) {}

console.log(parseMarkdown(fs.readFileSync(path.join(__dirname, '../__tests__/demo.md')).toString()))
