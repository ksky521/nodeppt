/**
 * @author theowang
 */
;!function($){
    var socket = io.connect(location.href);
    var toArray = function(nodelist){
        return [].slice.call(nodelist);
    },
    addUser = function(uid,uname,rebuild){
		rebuild = typeof rebuild === 'boolean' ? rebuild : true;
        var html = '<input type="checkbox" name="checkbox-1a" id="user'+uid+'" class="custom" value="'+uid+'" />'+
                '<label for="user'+uid+'">'+uname+'</label>';
        $('#users').append(html);
		rebuild && $('#usersContent').trigger('pagecreate');
    },
    delUser = function(uid){
        $('#uid'+uid).remove();
    },
	addSlide = function(arr){
		var html = '',t;
		for(var i = 0, len = arr.length; i < len; i++){
			t = arr[i];
			html += '<div data-role="collapsible" id="'+t.id+'" onclick="slideSocket.progress(\''+t.id+'\')">'+
			            '<h3>' + t.title + '</h3>'+
			            '<p>' + t.content + '</p>'+
			        '</div>';
		}
		$('#slideList').html(html).trigger('pagecreate');
	}
    
    window.slideSocket = {
//              send:function(key,value){
//                  socket.emit(key,value);
//              },
        send:function(value){
            socket.emit('ctrl ppt action',{action:value});
        },
		progress:function(id){
			socket.emit('ctrl ppt progress',{progress:id});
		},
        ctrl:function(){
            var uids = [];
            $('#users').find('input').each(function(i,el){
				//console.log(el);
                if(el.checked){
                    uids.push(el.value);
                }
            });
			//console.log(uids);
            socket.emit('ctrl users',{uids:uids});
        },
        init:function(){
            socket.on('user list',function(data){
                var users = data.users || [], len = users.length;
                $('#users').html('');
                console.log(data);
                while (len--) {
                    var user = users[len] || {};
                    if (user.uid && user.uname) {
                        addUser(user.uid, user.uname,false);
                    }
                }
				$('#usersContent').trigger('pagecreate');
            });
//                  socket.on('user connect',function(data){
//                      addUser(data.uid,data.uname);
//                  });
            socket.on('user exit',function(data){
                delUser(data.uid);
            });
            socket.on('ppt slide list',function(data){
				var list = data.list;
				addSlide(list);
			});
			socket.on('ppt progress',function(data){
				//console.log(data);
				//监听到进度内容，进行处理
				var $node = $('#slideList').find('#'+data.progress);
				$node.trigger('expand');
//				var pageTop = $(window).pageTop(),top = $node.position().top;
//				if(pageTop>)
//				$('#slideList').css('marginTop',-$node.position().top);
			});
        }
    };

}(jQuery);