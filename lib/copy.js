const path = require('path')

const libDir = path.join(__dirname, path.sep)
const $ = require('./helper')
const rootDir = path.join(libDir, '../', path.sep)

module.exports = function (destDir) {
  destDir = $.getDirPath(destDir)
  let assetsDir = rootDir + 'assets'
  // 复制assets文件夹
  $.copy(assetsDir, path.join(destDir, 'assets'), function (filename, dir, subdir) {
    if (!subdir) {
      return false
    }
    return true
  })
  // 复制template文件夹
  $.copy(rootDir + 'template', path.join(destDir, 'template'), function (filename, dir, subdir) {
    if (!subdir && filename === 'default.ejs') {
      return false
    }
    return true
  })
  // 复制ppts文件夹
  $.copy(rootDir + 'ppts', path.join(destDir, 'ppts'), function (filename, dir, subdir) {
    if (!subdir && filename === 'demo.html') {
      return false
    }
    return true
  })

  // 复制 config.json
  let configs = ['config.json']
  configs.map(function (filename) {
    let filepath = path.join(rootDir, filename)
    $.copy(filepath, path.join(destDir, filename))
  })
}
