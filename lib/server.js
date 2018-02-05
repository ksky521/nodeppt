const fs = require('fs')
const URL = require('url')
const debug = require('debug')('server')
const path = require('path')
const exec = require('child_process').exec

const mimes = require('./mime.json')
const $ = require('./helper')
const connect = require('connect')
const libDir = __dirname
const rootDir = path.join(libDir, '../') + path.sep
const templateDir = path.join(rootDir, 'template') + path.sep

const chokidar = require('chokidar')
const mdParser = require('./md_parser')
// session相关
const Cookie = require('cookie')
const parseSignedCookie = connect.utils.parseSignedCookie
const MemoryStore = connect.middleware.session.MemoryStore
const Session = connect.middleware.session.Session
// 建立一个memory store的实例
const storeMemory = new MemoryStore({
  reapInterval: 60000 * 10
})
module.exports.start = function (port, pptDir, host, argvObj) {
  port = parseInt(port, 10) || 8080
  pptDir = (pptDir || path.join(__dirname, '../ppts')) + path.sep
  try {
    pptDir = fs.realpathSync(pptDir) + path.sep
  } catch (e) {}

  let app = startApp(port, pptDir, host, argvObj)
  let io = require('socket.io').listen(app, {
    log: false,
    origins: '*:*' // 解决同源策略
  })
  // 设置session
  io.set('authorization', function (handshakeData, accept) {
    // 通过客户端的cookie字符串来获取其session数据
    let ccc = ''
    if (handshakeData.headers && handshakeData.headers.cookie) {
      ccc = handshakeData.headers.cookie
    }
    handshakeData.cookie = Cookie.parse(ccc)
    let connectSid = parseSignedCookie(handshakeData.cookie['connect.sid'], 'wyq')
    if (connectSid) {
      storeMemory.get(connectSid, function (error, session) {
        if (error) {
          // if we cannot grab a session, turn down the connection
          accept(error.message, false)
        } else {
          // save the session data and accept the connection
          handshakeData.session = new Session(handshakeData, session)
          handshakeData.connect_sid = connectSid
          accept(null, true)
        }
      })
    } else {
      accept('nosession')
    }
  })

  // watcher对应的socket
  let watchSockets = {}
  if (argvObj.watch) {
    // 添加watch功能
    let exclude = ['\\/\\.', 'node_modules']

    let watcher = chokidar.watch(pptDir, {
      ignored: new RegExp(exclude.join('|')),
      persistent: true
    })
    watcher.on('change', function () {
      sendChangedNotice()
    })
    io.of('/watcher').on('connection', function (socket) {
      watchSockets[socket.id] = socket
    })
  }

  // 用户双屏通信
  let sockets = {}
  let userMap = {}

  io.of('/ppt').on('connection', function (socket) {
    // 解析cookie中的sid
    let cookie = socket.handshake.headers.cookie
    cookie = Cookie.parse(cookie || '')
    let uid = cookie['connect.sid']
    socket.uid = uid

    sockets[uid] = socket
    // 监听添加map
    socket.on('control.addClient', function (data) {
      let targetUid = socket.targetUid = data.targetUid
      let otherSocket = sockets[targetUid]
      userMap[targetUid] = uid
      userMap[uid] = targetUid

      otherSocket && otherSocket.emit('system', {
        action: 'join',
        joinUid: uid
      })
    })
    // 建立消息中转站
    socket.on('transfer.data', function (data) {
      let uid = socket.uid
      let targetUid = userMap[uid]
      let otherSocket = sockets[targetUid]
      otherSocket && otherSocket.emit('transfer.data', data)
    })
    // 将当前分配的uid告知客户端
    socket.emit('UUID', uid)

    socket.on('disconnect', function () {
      let uid = socket.uid
      let targetUid = userMap[uid]
      let otherSocket = sockets[targetUid]
      otherSocket && otherSocket.emit('system', {
        action: 'leave',
        leaveUid: uid
      })
      delete sockets[uid]
    })
  })

  function sendChangedNotice () {
    if (!Object.keys(watchSockets)) {
      return console.error('[watch-connect]', 'No client connected to socket.io')
    }
    Object.keys(watchSockets).forEach(function (s) {
      if (watchSockets[s] && watchSockets[s].emit) {
        watchSockets[s].emit('file changed')
      }
    })
  }
}

function startApp (port, dir, host, argvObj) {
  host = host || '0.0.0.0'
  let staticDir = path.normalize(path.join(__dirname, '../assets')) + path.sep
  // 这里需要注意connect依赖不需要就要删除
  let nodeModules = path.normalize(path.join(require.resolve('connect/package.json'), '../..')) + path.sep
  let pptDir = dir

  let app = connect(
    connect.cookieParser(),
    connect.session({
      secret: 'wyq',
      store: storeMemory
    }),
    function (req, res) {
      let url = URL.parse(req.url).pathname
      let dirname = path.dirname(url)
      let realPath, ext
      if (url === '/') {
        // 根目录显示list
        pptlist(res, pptDir, argvObj)
        return
      } else if (dirname === '/md') {
        // md文件解析
        url = URL.parse(req.url).pathname
        let basename = path.basename(url)
        try {
          basename = decodeURIComponent(basename)
        } catch (e) {
          basename = path.basename(url)
        }
        let queryObj = URL.parse(req.url, true).query
        realPath = pptDir + basename
        debug('markdown', realPath, basename)
        markdown(realPath, basename, res, argvObj, queryObj)
        return
      } else if (/^\/js\/mathjax/.test(dirname)) {
        // 处理mathjax
        realPath = url.replace('/js/', nodeModules)
        ext = path.extname(realPath)
        ext = ext ? ext.slice(1) : 'unknown'
      } else {
        // 优先选择pptDir的静态资源
        url = url.indexOf('/') === 0 ? url.substring(1) : url
        realPath = pptDir + url
        if (!fs.existsSync(realPath)) {
          realPath = staticDir + url
        }
        ext = path.extname(realPath)
        ext = ext ? ext.slice(1) : 'unknown'
      }
      assets(realPath, ext, url, res, argvObj)
    }).listen(port, host)
  return app.on('listening', function () {
    let server = app.address()
    let address = server.address === '0.0.0.0' ? '127.0.0.1' : server.address
    let url = '  http://' + address + ':' + server.port

    debug('ppt directory:'.cyan + '           ' + pptDir)
    debug('assets directory:'.cyan + '        ' + staticDir)
    debug('nodeppt server started:'.cyan + url.yellow)

    if (process.platform === 'win32') {
      exec('start' + url)
    } else {
      exec('open' + url)
    }
  }).on('error', function (e) {
    if (e.code === 'EADDRINUSE' || e.code === 'EACCES') {
      console.log('ERROR: '.red + 'port ' + port + ' is in use!')
    } else {
      console.log('ERROR: '.red + 'server start ' + host + ':' + port + ' info : ' + e.code)
    }
  })
}

function assets (realPath, ext, url, res, argvObj) {
  // 静态资源
  if (fs.existsSync(realPath)) {
    fs.readFile(realPath, 'binary', function (err, file) {
      if (err) {
        res.writeHead(500, {
          'Powered-By': 'nodeppt',
          'Content-Type': 'text/plain'
        })
        res.end(err)
      } else {
        res.writeHead(200, {
          'Powered-By': 'nodeppt',
          'Content-Type': mimes[ext] || 'text/plain'
        })
        res.write(file, 'binary')
        res.end()
      }
    })
  } else {
    page404(res, url)
  }
}

function page404 (res, url) {
  res.writeHead(404, {
    'Powered-By': 'nodeppt',
    'Content-Type': mimes.txt
  })

  res.write('This request URL ' + url + ' was not found on this server.')
  res.end()
}

function markdown (realPath, url, res, argvObj, queryObj) {
  if (fs.existsSync(realPath)) {
    let content = fs.readFileSync(realPath, 'utf-8').toString()
    try {
      let html = mdParser(content, function () {}, argvObj, queryObj)
      // 添加socket的html代码
      let extraHtml = ''
      if (argvObj.watch) {
        extraHtml += getWatcherHtml()
      }
      if (extraHtml.trim() !== '') {
        html = html.split('<!--placeholder-->').join(extraHtml)
      }

      res.writeHead(200, {
        'Powered-By': 'nodeppt',
        'Content-Type': mimes.html
      })
      res.write(html)
      res.end()
    } catch (e) {
      res.writeHead(500, {
        'Powered-By': 'nodeppt',
        'Content-Type': 'text/plain'
      })
      res.end(e.toString())
    }
  } else {
    page404(res, url)
  }
}

/**
 * 读取ppt列表
 * @param  {[type]} res [description]
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */

function pptlist (res, dir, argvObj) {
  res.writeHead(200, {
    'Powered-By': 'nodeppt',
    'Content-Type': mimes.html
  })

  let curPath = dir

  let count = 0
  let list = ''
  // 遍历html文件
  $.recurse(dir, function (realpath, rootdir, subdir, filename) {
    count++
    let content = fs.readFileSync(realpath, 'utf-8').toString()
    let title = content.match(/<title>(.*?)<\/title>/) || []
    if (title[1]) {
      title = title[1]
    } else {
      title = filename
    }
    let url = filename
    list += '<li><a class="star" href="' + url + '" target="_blank">' + title + '</a></li>'
  }, '', '', function (filename) {
    return /\.htm[l]?/.test(filename)
  })

  // 遍历markdown文件
  $.recurse(dir, function (realpath, rootdir, subdir, filename) {
    count++
    let content = fs.readFileSync(realpath, 'utf-8').toString()
    // 第一个是封面
    let cover = content.split('[slide]').shift()

    let title = mdParser.parseCover(cover).title

    if (!title) {
      title = filename
    }
    let url = '/md/' + filename
    list += '<li><a class="star" href="' + url + '" target="_blank">' + title + '</a>'
    list += (argvObj.controller === 'socket' ? '' : '<a href="' + url + '?_multiscreen=1" target="_blank" title="多窗口打开" class="mult-link">多窗口</a><a href="' + url + '?controller=socket" target="_blank" title="用socket远程控制" class="socket-link">远程控制</a>') + '</li>'
  }, '', '', function (filename) {
    return /\.(md|markdown)$/.test(filename)
  })

  let json = require(path.join(__dirname, '../package.json'))

  let data = {
    version: json.version,
    site: json.site,
    date: Date.now(),
    list: list,
    dir: curPath
  }
  // 渲染模板
  let html = $.renderFile(templateDir + 'list.ejs', data)
  res.write(html)
  if (count === 0) {
    // 路径不存在ppt
    res.write('This directory ' + curPath + ' was not found html on this server.')
    debug(('This directory ' + curPath + ' was not found html on this server.').red)
  }
  res.end()
}

function getWatcherHtml () {
  let html = [
    '<script src="/socket.io/socket.io.js"></script>',
    '<script>',
    '(function(window, document, io){',
    '    let socket = io.connect(location.host+"/watcher")',
    '    socket.on("file changed", reload).on("reconnect", reload)',
    '    function reload() { location.reload() }',
    '}(window, document, io))',
    '</script>'
  ].join('')
  return html
}
