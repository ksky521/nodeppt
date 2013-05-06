var mimes = require(__dirname + '/mime.json');
var fs = require('fs');
var URL = require('url');
var path = require('path');
var connect = require('connect');
//session 相关
var cookie = require('cookie');
var parseSignedCookie = connect.utils.parseSignedCookie;
var MemoryStore = connect.middleware.session.MemoryStore;
var Session = connect.middleware.session.Session;
//建立一个memory store的实例
var storeMemory = new MemoryStore({
    reapInterval: 60000 * 10
});

module.exports.start = function(port) {
    port = parseInt(port, 10) || 8080;
    var app = startApp(port);
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
        console.log('socket.io:'+uid);
        sockets[uid] = socket;
        //监听添加map
        socket.on('add client', function(data) {
            var targetUid = socket.targetUid = data.targetUid;
            var anotherSocket = sockets[targetUid];
            userMap[targetUid] = uid;
            userMap[uid] = targetUid;
            // anotherSocket.emit('clinet connect', {

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

function startApp(port) {
    var staticDir = path.join(__dirname, '../src') + '/';
    var pptDir = path.join(__dirname, '../ppts') + '/';
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
        } else {
            realPath = staticDir + url;
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