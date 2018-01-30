const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

const read = require('read')
require('colors')

const $ = require('./helper')

const libDir = __dirname
const rootDir = path.join(libDir, '../')
const templateDir = path.join(rootDir, 'template') + path.sep

const templateQ = [{
  name: 'filename',
  prompt: 'filename'.bold.green,
  'default': 'demo'
}, {
  name: 'title',
  prompt: 'title'.bold.green,
  'default': 'slide title'
}, {
  name: 'subtitle',
  prompt: 'subtitle'.bold.green,
  'default': ''
}, {
  name: 'speaker',
  prompt: 'speaker'.bold.green,
  'default': 'speaker'
}]
const ppt = module.exports = {
  pdf: function (args) {
    let url = args[0]
    let output = args[1] ? args[1] : ''

    if (!url) {
      console.log('ERROR: pdf need a URL'.bold.red)
      ppt.help('pdf')
      return
    }
    if (output === '') {
      output = 'nodeppt.pdf'
    }
    if (output.slice(-4) !== '.pdf') {
      output += '.pdf'
    }
    let child = exec('phantomjs ' + libDir + '/pdf.js ' + url + ' ' + output)
    // child.stderr.setEncoding('utf8')
    child.stderr.on('data', function (data) {
      console.log('please install phantomjs：npm install -g phantomjs'.red)
      console.log('nodeppt pdf depend phantomjs '.red)
    })
    child.stdout.on('data', function (data) {
      console.log(data)
    })
  },
  start: function (argsObj) {
    // 启动
    let curRoot = process.cwd()

    let dir = argsObj.dir
    if (dir === '') {
      dir = curRoot // path.join(rootDir, 'ppts')
    }

    if (!fs.existsSync(dir)) {
      dir = path.join(curRoot, dir)
      if (!fs.existsSync(dir)) {
        return console.log('\nERROR: '.bold.red + dir + ' not a right path')
      }
    } else {
      let stat = fs.statSync(dir)
      if (!stat.isDirectory()) {
        return console.log('\nERROR: '.bold.red + dir + ' not a right path')
      }
    }

    require(libDir + '/server').start(argsObj.port, dir, argsObj.host, argsObj)
  },
  create: function (filename, options) {
    let curRoot = process.cwd()

    if (options && options.dir) {
      curRoot = options.dir
    }

    let opts = {
      isHTML: false
    }

    if (filename) {
      filename = filename.replace(/\.htm[l]?$/, '')
      opts.isHTML = /\.htm[l]?$/.test(filename)
      opts.filepath = opts.isHTML ? path.join(curRoot, filename + '.html') : path.join(curRoot, filename + '.md')

      if ($.exists(opts.filepath)) {
        console.log('ERROR: '.bold.red + ' ' + filename + ' already exist！')
        return false
      }
      opts.filename = filename

      templateQ.splice(0, 1)
    }

    console.log('please input：'.bold.green);

    (function next (prompt) {
      if (!prompt) {
        return doneTmpl(opts)
      }
      read(prompt, function (err, value) {
        if (err) {
          return console.log('\nERROR: '.bold.red + '获取 "' + prompt.name + '" 输入信息失败')
        }
        opts[prompt.name] = value
        next(templateQ.shift())
      })
    })(templateQ.shift())
  },
  generate: function (filename, output, all, rDir) {
    require(libDir + '/generate')(filename, output, all, rDir)
  }
}

function doneTmpl (opts) {
  if (opts.filename === '') {
    opts.filename = Date.now()
  }
  let json = require(path.join(libDir, '../package.json'))
  opts.version = json.version
  opts.site = json.site

  let html = $.renderFile(templateDir + (opts.isHTML ? 'default.ejs' : 'defaultmd.ejs'), opts)

  $.writeFile(opts.filepath, html)
  console.log(('Success：' + opts.filename + (opts.isHTML ? '.html' : '.md') + ', please write your slide content').bold.green)
}
