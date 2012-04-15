/**
 * 用于ppt播放进度远程控制
 * 
 */
/*******************************引入模块************************************************************/
var express = require('express'),
    sio = require('socket.io'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    parseCookie = require('connect').utils.parseCookie,
    storeMemory = new express.session.MemoryStore();

/*******************************express配置********************************************************/
var app = express.createServer();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
		secret: 'theowang',
		store: storeMemory
	}));
	app.use(express.methodOverride());
    app.use(app.router);//要放在bodyParser之后，处理post
	app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    
    app.use(express.static(__dirname + '/static'));
});


/*************************************websocket ctrl***********************************************/
var WS = {}, ctrlWS = {}, ctrlUserWS = {}, users = {}, slides = {};
var io = sio.listen(app);

io.of('/ctrl').on('connection',function(socket){
    console.log('         socket=========================>ctrl');
	
	var session = socket.handshake.session || {};//session
	var pptid = session.ctrlPPTID || 0;
	console.log('======================>', pptid);
	
	if (pptid) {
		ctrlWS[pptid] && delete ctrlWS[pptid];
		ctrlWS[pptid] = socket;
	}else {
		return 'Error: ctrl no session';
	}
	socket.on('ctrl users', function(data){
//		console.log(data);
		ctrlUserWS[pptid] = data.uids;
	});
	
	
	
	socket.on('ctrl ppt action', function(data){
//		console.log('ctrl ppt action=============>', data);
//		console.log('ctrl ppt action=============>', ctrlUserWS[pptid]);
		
		if (ctrlUserWS[pptid]) {
			ctrlUserWS[pptid].forEach(function(id){
				
//				console.log(WS[pptid + id]);
				WS[pptid + id].emit('ppt do', data);
			});
		}
	});
	
	socket.on('ctrl ppt progress',function(data){
//		console.log('ctrl progress===============>',data);
		
		if (ctrlUserWS[pptid]) {
            ctrlUserWS[pptid].forEach(function(id){
//                console.log(WS[pptid + id]);
                WS[pptid + id].emit('ppt progress do', data);
            });
        }
	});
	
	console.log(users);
	
	ctrlWS[pptid] && ctrlWS[pptid].emit('user list', {
		users: users[pptid]
	});
	
	slides[r] && ctrlWS[r].emit('ppt slide list',slides[r]);
});

/*******************************通过router的json来控制ppt*******************************************/
//通过router的json来控制ppt，访问url示例：a.ppt

var routes = require('./router.json');
var _userID = 1;//ppt观看者用户编号

var readPPT = function(r,tmp, req, res){
//	var template = tmp.template;
	
	res.render('ppt',{layout:false,locals:tmp});
	
//	var realpath = __dirname + '/ppt/' + url.parse(template).pathname;
//	if (path.existsSync(realpath)) {
//		var txt = fs.readFileSync(realpath);
//		res.end(txt);
//	}
//	else {
//		res.end('404' + realpath);
//		return 'Error 404: not found '+realpath;
//	}
}
/**
 * 判断用户名是否唯一
 * @param {Object} uname
 */
function unqUser(route,uname){
	if(uname===''){
		return false;
	}
	var r = true, user = users[route]||[];
	var i = user.length;
	while(i--){
		var temp = user[i].uname||'';
        if(temp === uname){
            r = false;
            break;
        }
	}

	return r;
}
function delUser(route,uname){
	if(uname==='' || users[route] && users[route].length===0){
        return ;
    }
    var user = users[route];
    var i = user.length;
    while(i--){
        var temp = user[i].uname||'';
		console.log(temp);
        if(temp === uname){
			
            user = user.splice(i,1);
			console.log(users);
            break;
        }
    }
}
/**
 * 去除两端空格
 * @param {Object} str
 */
function trim(str){
	return str.replace(/^\s+|\s+$/g,'');
}
//ppt页面
for(var r in routes){
    
    io.of(r).on('connection',function(r){
		return function(socket){
			console.log('         socket=========================>' + r);
			var session = socket.handshake.session || {};
			session = session[r] || {};
		    var uid = session.uid,
                 uname = session.uname
			
			if(!uid || !uname){
				return;
		    }
			
			var wsIndex = r + uid;
			WS[wsIndex] && delete WS[wsIndex];
			WS[wsIndex] = socket;
			
			socket.on('disconnect', function(){
				if(ctrlWS[r]){
					delUser(r,uname);
                    ctrlWS[r].emit('user list', {
						users: users[r]
					});
//					delete ctrlWS[r];
				}
            });
			
			socket.on('ppt progress', function(data){
			    console.log('ppt progress==========================',data);
				ctrlWS[r] &&
				ctrlWS[r].emit('ppt progress', data);
				
			});
	
			socket.on('ppt slide list',function(data){
				ctrlWS[r] &&
	            ctrlWS[r].emit('ppt slide list',data);
				slides[r] = data;
			});
			
			if(ctrlWS[r]){
				
				ctrlWS[r].emit('user list', {
					users: users[r]
				});
				
				slides[r] && ctrlWS[r].emit('ppt slide list',slides[r]);
			}
			
			
		}
    }(r));
	
    app.get(r,function(r,tmp){
        return function(req,res){
			var session = req.session || {};
			
			if(session[r]){
				
				readPPT(r,tmp,req,res);
				//唯一性处理
				if(unqUser(r,session[r].uname)){
				    users[r].push(session[r]);	
				}
			}else{
				//读取登录页面，要求登录
				res.render('login',{locals:{title:'登录后开始PPT',nameText:'姓名',name:'name'}});
			}
			
        }
    }(r,routes[r]));
	
	app.post(r,function(r,tmp){
		return function(req, res){
			var session = req.session || {};
            session = session[r];
			
			var name = trim(req.body.name),
				password = req.body.password;
			//console.log('        ',r,'uname===============>',unqUser(r,name));
            if(!session && !unqUser(r,name)){
				res.end('Error: username is blank or exist!');
			}else if (password === tmp.password) {
				
				var uid = _userID++;
				req.session[r] = {
					uname:name,
					uid:uid
				}
				if (!users[r]) {
	                users[r] = [];
	            }
				
	            users[r].push({
	                uid: uid,
	                uname: name
	            });
				readPPT(r,tmp, req, res);
			}
			else {
				res.end('Error: authorization');
			}
		}
	}(r,routes[r]));
}

/*******************************首页，列出list******************************************************/
//
app.get('/', function(req, res){
	var session = req.session;
	if (session.pptID) {
		res.send('你已经访问了一个ppt文件，是否继续访问？<a href="' + session.pptID + '">继续</a>');
	}
	if (session.ctrlPPTID) {
		res.send('你已经<span style="color:red">控制</span>了一个ppt文件，是否继续访问？<a href="' +
		session.ctrlPPTID + '">继续</a>');
	}
	
	fs.readFile(__dirname + '/index.html', function(err, data){
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		
		//res.writeHead(200);
		res.end(data);
	});
});


/*******************************控制页面************************************************************/
var ctrlRead = function(req, res){
	fs.readFile(__dirname + '/ctrl.html', function(err, data){
		if (err) {
			res.writeHead(500);
			return res.end('Error loading ctrl.html');
		}
		
		res.end(data);
	});
}

//提交控制页面

app.get('/ctrl', function(req, res){
	if (req.session.ctrlPPTID && req.session.ctrlPPTID !== '') {
        
		ctrlRead(req, res);
	}else {
	   //读取登录页面，要求登录
	   res.render('login',{locals:{title:'登录后控制PPT',nameText:'PPTID',name:'pptid'}});
	}
	
});

app.post('/ctrl',function(req,res){
    var pptid = req.body.pptid,
    	password = req.body.password;
    pptid = pptid.indexOf('/')===0?pptid:('/'+pptid);
    var route = routes[pptid];

    if(pptid && pptid!=='' && route.password === password){
        req.session.ctrlPPTID = pptid;
		        
        ctrlRead(req, res);
    }else{
        res.end('Error: authorization');
    }
});

/*******************************SOCKET authorization***********************************************/

//socket处理session
io.set('authorization', function(handshakeData, callback){
    // 通过客户端的cookie字符串来获取其session数据
    handshakeData.cookie = parseCookie(handshakeData.headers.cookie);
    var connect_sid = handshakeData.cookie['connect.sid'];
    
    if (connect_sid) {
        storeMemory.get(connect_sid, function(error, session){
            if (error) {
                // if we cannot grab a session, turn down the connection
				console.log('authorization Error====>',error);
                callback(error.message, false);
            }
            else {
                // save the session data and accept the connection
                handshakeData.session = session;
				console.log('   authorization =============> success');
                callback(null, true);
            }
        });
    }
    else {
        callback('nosession');
    }
});

/*******************************开始app************************************************************/
app.listen(3000, function(){
    var addr = app.address();
    console.log('app listening on http://127.0.0.1：' + addr.port);
});