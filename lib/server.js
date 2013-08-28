var mimes = require(__dirname + '/mime.json');
var fs = require('fs');
var URL = require('url');
var path = require('path');
var connect = require('connect');
var grunt = require('grunt');
//session 相关
var cookie = require('cookie');
var parseSignedCookie = connect.utils.parseSignedCookie;
var MemoryStore = connect.middleware.session.MemoryStore;
var Session = connect.middleware.session.Session;
//建立一个memory store的实例
var storeMemory = new MemoryStore({
    reapInterval: 60000 * 10
});

module.exports.start = function(port, pptDir) {
    port = parseInt(port, 10) || 8080;
    var app = startApp(port, pptDir);
    var io = require('socket.io').listen(app, {
        // log: false,
        origins: '*:*' //解决同源策略
    });
    //设置session
    io.set('authorization', function(handshakeData, accept) {
        // 通过客户端的cookie字符串来获取其session数据
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie)
        var connect_sid = parseSignedCookie(handshakeData.cookie['connect.sid'], 'wyq');
        if (connect_sid) {
            storeMemory.get(connect_sid, function(error, session) {
                if (error) {
                    // if we cannot grab a session, turn down the connection
                    accept(error.message, false);
                } else {
                    // save the session data and accept the connection
                    handshakeData.session = new Session(handshakeData, session);
                    handshakeData.connect_sid = connect_sid;
                    accept(null, true);
                }
            });
        } else {
            accept('nosession');
        }
    });

    var now = Date.now();

    var sockets = {};
    var userMap = {};

    io.sockets.on('connection', function(socket) {
        var session = socket.handshake.session; //session
        // var uid = now++;
        var uid = session.uid;

        socket.uid = uid;
        console.log('socket.io:' + uid);
        sockets[uid] = socket;
        //监听添加map
        socket.on('add client', function(data) {
            var targetUid = socket.targetUid = data.targetUid;
            var otherSocket = sockets[targetUid];
            userMap[targetUid] = uid;
            userMap[uid] = targetUid;

            otherSocket && otherSocket.emit('system', {
                action: 'join',
                joinUid: uid
            });
            // otherSocket.emit('clinet connect', {

            // });
        });
        //建立消息中转站
        socket.on('repost data', function(data) {
            var uid = socket.uid;
            var targetUid = userMap[uid];
            var otherSocket = sockets[targetUid];
            console.log(data, uid, targetUid);
            otherSocket && otherSocket.emit('data from another client', data);
        });

        //将当前分配的uid告知客户端
        socket.emit('UUID', uid);

        socket.on('disconnect', function() {
            var uid = socket.uid;
            var targetUid = userMap[uid];
            var otherSocket = sockets[targetUid];
            otherSocket && otherSocket.emit('system', {
                action: 'leave',
                leaveUid: uid
            });
            delete sockets[targetUid];
        });
    });

}

function startApp(port, dir) {
    var staticDir = path.join(__dirname, '../assets') + '/';
    var pptDir = (dir || path.join(__dirname, '../ppts')) + '/';
    console.log('路径：' + pptDir, '静态路径：' + staticDir);
    var now = Date.now();
    var app = connect(
        connect.cookieParser(),
        connect.session({
            secret: 'wyq',
            store: storeMemory
        }),

        function(req, res) {
            var url = URL.parse(req.url).path;
            var dirname = path.dirname(url);
            var realPath, ext;
            if (dirname === '/ppt') {

                var uid = req.session.uid;
                if (!uid) {
                    uid = now++; //当前连接用户的UID
                    req.session.uid = uid;
                    console.log('new user: ' + uid);
                } else {
                    console.log('welcome back ' + uid);
                }

                realPath = pptDir + path.basename(url, '.html') + '.html';
                ext = 'html';
            } else if (dirname === '/') {
                pptlist(res, pptDir);
                return;
            } else {
                //优先选择pptDir的静态资源
                realPath = pptDir + url;
                if (!fs.existsSync(realPath)) {
                    realPath = staticDir + url;
                }

                ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'unknown';
            }


            //静态资源
            if (fs.existsSync(realPath)) {
                fs.readFile(realPath, 'binary', function(err, file) {
                    if (err) {
                        res.writeHead(500, {
                            'Powered-By': 'nodePPT',
                            'Content-Type': 'text/plain'
                        });
                        res.end(err);
                    } else {
                        res.writeHead(200, {
                            'Powered-By': 'nodePPT',
                            'Content-Type': mimes[ext]
                        });
                        res.write(file, 'binary');
                        res.end();
                    }

                });

            } else {
                res.writeHead(404, {
                    'Powered-By': 'nodePPT',
                    'Content-Type': mimes.txt
                });

                res.write('This request URL ' + url + ' was not found on this server.');
                res.end();
            }

        }).listen(port);

    return app;
}
/**
 * 读取ppt列表
 * @param  {[type]} res [description]
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */

function pptlist(res, dir) {
    var staticDir = path.join(__dirname, '../assets') + '/';
    res.writeHead(200, {
        'Powered-By': 'nodePPT',
        'Content-Type': mimes.html
    });
    //获取模版
    var html = fs.readFileSync(staticDir + 'list.tpl', 'utf-8').toString();

    var count = 0,
        list = '';
    //遍历
    recurse(dir, function(abspath, rootdir, subdir, filename) {
        count++;
        var content = fs.readFileSync(abspath, 'utf-8').toString();
        var title = content.match(/<title>(.*?)<\/title>/);
        if (title[1]) {
            title = title[1];
        } else {
            title = filename;
        }
        list += '<li><a href="/ppt/' + filename + '" target="_blank">' + title + '</a></li>';
    },'', function(filename){
        return /\.htm[l]?/.test(filename);
    });
    if (count == 0) {
        //路径不存在ppt
        res.write('This dir ' + dir + ' was not found html on this server.');
        res.end();
    }
    var json = require(path.join(__dirname, '../package.json'));
    var data = {
        version: json.version,
        site: json.site,
        date: Date.now(),
        list: list,
        dir: dir.slice(-1) === '/' ? dir.slice(0, dir.length - 1) : dir
    };
    html = grunt.template.process(html, {
        data: data
    });
    res.write(html);
    res.end();
}

var win32 = process.platform === 'win32';
var unixifyPath = function(filepath) {
    if (win32) {
        return filepath.replace(/\\/g, '/');
    } else {
        return filepath;
    }
};

function recurse(rootdir, callback, subdir, judgeFunction) {
    var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
    judgeFunction = typeof judgeFunction === 'function' ? judgeFunction : function() {
        return true;
    };
    fs.readdirSync(abspath).forEach(function(filename) {
        var filepath = path.join(abspath, filename);
        if (fs.statSync(filepath).isDirectory() && judgeFunction(filename)) {
            recurse(rootdir, callback, unixifyPath(path.join(subdir, filename)), judgeFunction);
        } else {
            judgeFunction(filename) && callback(unixifyPath(filepath), rootdir, subdir, filename, judgeFunction);
        }
    });

}