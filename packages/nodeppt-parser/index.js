const path = require('path')
const fs = require('fs-extra')
const defaultDeep = require('lodash.defaultsdeep')
const ejs = require('ejs')
const loaderUtils = require('loader-utils')
const parser = require('./lib/parser')
// parsers
const yamlParser = require('./lib/yaml-parser')

const defaults = require('./defaults')

// 模板
const template = fs.readFileSync(path.join(__dirname, './template/index.ejs')).toString()
module.exports = function(content) {
  const {plugins = []} = loaderUtils.getOptions(this)

  const settings = content.split(/<slide.*>/i)[0]
  // 首部 yaml 设置部分
  const globalSettings = defaultDeep(yamlParser(settings), defaults)
  content = parser(content.replace(settings, ''), plugins)

  return ejs.render(template, {...globalSettings, content})
}
