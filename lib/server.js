var mimes = require(__dirname + '/mime.json');
var fs = require('fs');
var URL = require('url');
var path = require('path');
module.exports.start = function(port) {
    port = parseInt(port, 10) || 8080;
    var app = startApp(port);
    var io = require('socket.io').listen(app, {
        // log: false,
        origins: '*:*' //解决同源策略
    });

    var now = Date.now();

    var sockets = {};
    var userMap = {};

    io.sockets.on('connection', function(socket) {
        var uid = now++; //当前连接用户的UID
        socket.uid = uid;
        sockets[uid] = socket;
        //监听添加map
        socket.on('add client', function(data) {
            var targetUid = socket.targetUid = data.tagetUid;
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
            otherSocket.emit('data from another client', data);
        });

        //将当前分配的uid告知客户端
        socket.emit('UUID', {
            uid: uid
        });

        socket.on('disconnect', function() {
            var uid = socket.uid;
            var targetUid = userMap[uid];
            var otherSocket = sockets[targetUid];
            otherSocket.emit('system', {
                action: 'leave',
                leaveUid: uid
            });
        });
    });

}

function startApp(port) {
    var staticDir = path.join(__dirname, '../src') + '/';
    var pptDir = path.join(__dirname, '../ppts') + '/';
    var app = require('http').createServer(function(req, res) {
        var url = URL.parse(req.url).path;
        var dirname = path.dirname(url);
        var realPath, ext;
        if (dirname === '/ppt') {
            realPath = pptDir + path.basename(url, '.html') + '.html';
            // console.log(realPath)
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