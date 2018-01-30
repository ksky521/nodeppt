// 系统
const path = require('path')

// 非系统
const marked = require('./marked')
const $ = require('./helper')
const libDir = __dirname
const rootDir = path.join(libDir, '../')
const templateDir = path.join(rootDir, 'template') + path.sep
const EOL = '\n'
const SUB_SILDE_PLACEHOLDER = '~~NODEPPT%THEO●WANG%NODEPPT%~~'
const M_SUB_SILDE_PLACEHOLDER = marked(SUB_SILDE_PLACEHOLDER)
const templateFile = templateDir + 'markdown.ejs'

const defaultJSON = {
  title: 'nodeppt markdown',
  url: '',
  speaker: '',
  content: '',
  theme: 'moon',
  transition: 'move',
  files: '',
  highlightStyle: 'monokai_sublime',
  headFiles: '',
  usemathjax: '', // 如果为yes，则引入mathjax，默认不建议开启，导出文件太多
  date: ''
}

marked.setOptions({
  gfm: true,

  // silent: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  langPrefix: ''
})

const emptyFn = function (str) {
  // console.log(str)
}
const parser = function (string, callback, argvObj, queryObj, commonData) {
  if (typeof callback !== 'function') {
    callback = emptyFn
  }
  let splitReg = /\[slide\s*(.*)]/ig
  let slidesSetting = string.match(splitReg) || []
  let contents = string.split(/\[slide.*]/i)
  // debug('内容原文：' + contents.length, '设置：' + slidesSetting)
  // 第一个是封面
  let cover = contents.shift()
  let json = parseCover(cover)
  json = $.mix({}, json, commonData)

  let config = require(path.join(libDir, '../package.json'))
  json.nodeppt_version = config.version
  json.nodeppt_site = config.site
  json = $.mix({}, defaultJSON, json, {
    query: $.mix(queryObj || {}, argvObj || {})
  })

  // 优先使用url的参数来控制，使用js来做，不再使用server
  'theme transition'.split().forEach(function (v) {
    if (json.query && json.query[v]) {
      json[v] = json.query[v]
    }
  })
  if (json.theme) {
    json.headFiles = [json.headFiles || '', '/css/theme.' + json.theme + '.css'].join(',')
  }
  json.headFiles = getFilesHtml(json.headFiles)
  json.files = getFilesHtml(json.files)

  let slides = []
  let noteReg = /\[note]([\s\S]+)\[\/note]/im
  let subReg = /\[subslide]([\s\S]+)\[\/subslide]/im
  let magicReg = /\[magic\b(.*)]([\s\S]+)\[\/magic]/im
  let subSeparator = /[=]{4,}/g
  contents.forEach(function (v, i) {
    let cfg = slidesSetting[i]
    cfg = cfg.match(/\[slide\s+(.+)\s?]/)
    let attrs = ''
    if (cfg) {
      attrs = cfg[1]
    }
    let note = noteReg.exec(v)
    if (note) {
      v = v.replace(noteReg, '')
      note = marked(note[1])
    }
    let subslide = subReg.exec(v)
    let extData = []
    let extType = ''
    let extAttr = ''
    if (subslide) {
      extType = 'subSlide'
      subslide = subslide[1].split(subSeparator)
        .filter(function (v) {
          return v && v.trim()
        })
      if (subslide.length > 1) {
        v = v.replace(subReg, EOL + SUB_SILDE_PLACEHOLDER + EOL)
        subslide.forEach(function (v, i) {
          extData.push(marked(v))
        })
      } else {
        v = v.replace(subReg, subslide[0])
      }
    }
    let magicSlide = magicReg.exec(v)
    if (magicSlide) {
      extType = 'magic'
      extAttr = magicSlide[1]
      attrs += '  data-on-build="Slide.magic" data-on-enter="Slide.magic.init"'
      magicSlide = magicSlide[2].split(subSeparator)
        .filter(function (v) {
          return v && v.trim()
        })

      if (magicSlide.length > 1) {
        v = v.replace(magicReg, EOL + SUB_SILDE_PLACEHOLDER + EOL)
        magicSlide.forEach(function (v, i) {
          extData.push(['<div class="magic-wrapper">', contentParser(marked(v)), '</div>'].join(EOL))
        })
      } else {
        v = v.replace(magicReg, magicSlide[0])
      }
    }
    v = v.trim()
    let tContent = ''
    if (v !== SUB_SILDE_PLACEHOLDER) {
      tContent = marked(v)
    }

    // 渲染
    slides.push(parse(tContent, {
      data: extData,
      type: extType,
      attr: extAttr
    }, note, attrs))
  })
  // 合并
  json.content = slides.join(EOL)

  // 解析
  let html = $.renderFile(templateFile, json)
  callback(html)
  return html
}
parser.parseCover = parseCover

module.exports = parser

/**
 * 解析cover的json字符串
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function parseCover (str) {
  str = str.split(EOL)
  let obj = {}
  let reg = /(\w+)\s?:\s?(.+)/
  str.forEach(function (val) {
    val = reg.exec(val)
    if (val) {
      obj[val[1]] = val[2]
    }
  })
  return obj
}

/**
 * 解析 slide内容
 * @param  {Array} contArr   [description]
 * @param  {[type]} note  [description]
 * @param  {[type]} sAttrs 头部属性
 * @return {[type]}       [description]
 */

function parse (content, extendTags, note, sAttrs) {
  let extendContent = ''
  if (extendTags && extendTags.type) {
    let extData = extendTags.data
    let extType = extendTags.type
    let extAtrr = extendTags.attr
    if (typeof extendTagsHandler[extType] === 'function') {
      extendContent = extendTagsHandler[extType](extData, extAtrr)
    }
  }

  if (content.trim() === '') {
    // 空的，证明全部是subslide
    content = extendContent
  } else {
    content = contentParser(content)
    content = content.replace(M_SUB_SILDE_PLACEHOLDER, extendContent)
  }
  // 处理备注的内容
  if (note && note.length > 3) {
    note = ['<aside class="note">', '<section>', note, '</section>', '</aside>'].join(EOL)
  } else {
    note = ''
  }
  let tagStart = '<slide class="slide' + (note ? ' hasnote' : '') + '">'

  // 处理[slide]的属性
  if (sAttrs) {
    let cls = sAttrs.match(/class=['"]?([^'"]+)['"]?/)
    if (cls) {
      cls = cls[1] + ' slide'
      sAttrs = sAttrs.replace(cls[0], '')
    } else {
      cls = 'slide'
    }
    if (/background/.test(sAttrs) && !/background-/.test(sAttrs) || /background-image/.test(sAttrs)) {
      cls += ' fill'
    }
    tagStart = '<slide class="' + cls + '" ' + sAttrs + '>'
    // console.log(tagStart)
  }
  return tagStart + note + '<section class="slide-wrapper">' + content + '</section></slide>'
}
let extendTagsHandler = {
  magic: function (data, attr) {
    attr = attr || 'data-transition="fade"'
    let clss = ['current pagedown', 'next pagedown', 'far-next pagedown']
    data = data.map(function (v, i) {
      return '<div class="magicItem ' + (clss[i] ? clss[i] : '') + '" ' + attr + '>' + contentParser(v) + '</div>'
    })
    return '<div class="magic">' + data.join(EOL) + '</div>'
  },
  subSlide: function (data, attr) {
    data = data.map(function (v) {
      return '<div class="subSlide">' + contentParser(v) + '</div>'
    })
    return data.join(EOL)
  }
}

function contentParser (str) {
  let arr = str.split('<hr>')
  let head = ''
  let article = ''

  if (arr.length === 2) {
    head = arr[0]
    article = arr[1]
  } else {
    article = str
  }
  if (head !== '') {
    head = doAttr(head)
    head = ['<hgroup>', head, '</hgroup>'].join(EOL)
  }

  let noHead = !head
  let articleAttr
  article = doAttr(article, true, noHead)

  article = ['<article>', article, '</article>'].join(EOL)
  // 处理文章只用h1的情况，作为标题页面
  if (noHead && /<h1>.*<\/h1>/g.test(article)) {
    article = article.replace(/<h1>([^<]+)(\s+\{:&amp(.+)\})<\/h1>/m, function (input, text, idinput, attrs) {
      articleAttr = parseAttr(idinput, attrs)
      return '<h1>' + text + '</h1>'
    })
    if (!articleAttr) {
      article = article.replace('<article>', '<article class="flexbox vcenter">')
    } else {
      article = article.replace('<article>', '<article ' + articleAttr + '>')
    }
  } else {
    article = article.replace(/<(\w+)>(\s?\{:(?:&amp)?([^&].+)\})<\/\1>/gm, function (input, tag, idinput, attrs) {
      articleAttr = parseAttr(idinput, attrs)
      return ''
    })
    // 特殊处理tb
    article = article.replace(/<(td|p)>(.*)(\s?\{:(?:&amp)?([^&].+)\})<\/\1>/gm, function (input, tag, con, idinput, attrs) {
      let a = parseAttr(idinput, attrs)
      if (con.indexOf('<span') === -1) {
        con = '<span>' + con + '<span>'
      }
      return '<' + tag + ' ' + a + '>' + con + '</' + tag + '>'
    })

    if (articleAttr) {
      article = article.replace('<article>', '<article ' + articleAttr + '>')
    }
  }
  article = article.replace(/<p>\s*<\/p>/g, '').replace(/<p>\s*(<img([^<]+)>)<\/p>/g, '$1')
  article = article.replace(/<p>\s*<p>(.*?)<\/p>\s*<\/p>/g, function (index, reg) {
    return '<p>' + reg + '</p>'
  })
  return head + article
}

/**
 * 替换属性
 * @param  {[type]}  str       [description]
 * @param  {Boolean} isArticle [description]
 * @param  {[type]}  noHead    [description]
 * @return {[type]}            [description]
 */
function doAttr (str, isArticle, noHead) {
  // input:## Title {:.build width="200px"}
  // output: <h2 class="build" width="200px">Title</h2>
  str = str.replace(/<(\w+)([^>]*)>([^<]+)(\s+\{:([^&].+)\})<\/\1>/gm, function (input, tag, pre, text, idinput, attrs) {
    let attr = parseAttr(idinput, attrs)
    attr = mergeAttr(pre, attr)
    return '<' + tag + ' ' + attr + '>' + text + '</' + tag + '>'
  })
  str = str.replace(/<(\w+)>([^<]+)<(\w+)>(.+)(\s+\{:&amp(.+)\})/mg, function (input, parentTag, parentText, childTag, childText, idinput, attrs) {
    let attr = parseAttr(idinput, attrs)
    return '<' + parentTag + ' ' + attr + '>' + parentText + '<' + childTag + '>' + childText
  })

  return str
}

/**
 * 合并attr
 * @param  {string} oldAttr 老属性
 * @param  {string} newAttr 新属性
 * @return {[type]}         [description]
 */
function mergeAttr (oldAttr, newAttr) {
  if (!oldAttr) {
    return newAttr
  }
  if (!newAttr) {
    return oldAttr
  }
  // 合并class style
  let oldAttrs = String(oldAttr).split(/\s+/)
  let newAttrs = String(newAttr).split(/\s+/)
  let old = {}
  let inew = {}
  let back = []
  oldAttrs.forEach(function (a) {
    let v = a.split('=')
    v[0] = v[0].toLowerCase()
    if (v[0] === 'class' || v[0] === 'style') {
      old[v[0]] = v[1].slice(1, -1).trim()
    } else {
      back.push(a)
    }
  })
  newAttrs.forEach(function (a) {
    let v = a.split('=')
    v[0] = v[0].toLowerCase()
    if (v[0] === 'class' || v[0] === 'style') {
      inew[v[0]] = v[1].slice(1, -1).trim()
    } else {
      back.push(a)
    }
  })
  'class style'.split().forEach(function (v) {
    // 两个都存在，则合并之
    switch (v) {
      case 'class':
        back.push('class="' + [old[v] || '', inew[v] || ''].join(' ').trim() + '"')
        break
      case 'style':
        back.push('style="' + [old[v] || '', inew[v] || ''].join('') + '"')
        break
    }
  })
  return back.join(' ')
}

/**
 * 解析自定义属性
 * @param  {[type]} idinput [description]
 * @param  {[type]} attrs   [description]
 * @return {[type]}         [description]
 */
function parseAttr (idinput, attrs) {
  attrs = attrs.split(/\s+/)
  // console.log(attrs)
  let attrArr = []
  let idArr = []
  let classArr = []
  attrs.forEach(function (attr) {
    if (~attr.indexOf('=')) {
      attrArr.push(attr)
    } else if (attr) {
      let ids = attr.split(/[#|.]/)
      // console.log(attr)
      ids.forEach(function (v) {
        if (v !== '') {
          (new RegExp('\\#' + v)).test(idinput) && idArr.push(v);
          (new RegExp('\\.' + v)).test(idinput) && classArr.push(v)
        }
      })
    }
  })

  let attr = ''
  let arr = []
  if (idArr.length > 0) {
    arr.push('id="' + idArr.join(' ') + '"')
  }
  if (classArr.length > 0) {
    arr.push('class="' + classArr.join(' ') + '"')
  }
  if (attrArr.length > 0) {
    arr.push(attrArr.join(' '))
  }
  attr = arr.join(' ').replace(/&#39/g, '\'')
    .replace(/&quot/g, '"')
    .replace(/&gt/g, '>')
    .replace(/&lt/g, '<')
    .replace(/&amp/g, '&')
  return attr
}

/**
 * 根据files返回html
 * @param  {String} files files
 * @return {string}       html
 */
function getFilesHtml (files) {
  files = (files || '').split(/\s?,\s?/)
  return files.map(function (v) {
    let basename = path.basename(v)
    if (/.js$/i.test(basename)) {
      // js文件
      return '<script src="' + v + '"></script>'
    } else if (/.css$/i.test(basename)) {
      // css文件
      return '<link rel="stylesheet" href="' + v + '">'
    }
    return v
  }).join(EOL)
}
