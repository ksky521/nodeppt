var fs = require('fs');
var path = require('path');
var join = path.join;
var grunt = require('grunt');
var gFile = grunt.file;
var gTpl = grunt.template;
var color = require('colors');
var read = require('read');

var libDir = __dirname;
var templateHTML = libDir + '/template.html';
var templateQ = [{
    name: 'title',
    prompt: '演讲题目',
    'default': '演讲题目'
}, {
    name: 'subtitle',
    prompt: '副标题',
    'default': ''
}, {
    name: 'speaker',
    prompt: '演讲者',
    'default': '演讲者'
}];
var ppt = module.exports = {
    help: function() {
        console.log('这里是help');
    },
    start: function(args) {
        //启动
        var port = 8080;
        for (var i = 0, len = args.length; i < len; i++) {
            if (args[i] === '--port') {
                port = args[i + 1] ? args[i + 1] : 8080;
                break;
            }
        }
        require(libDir + '/server').start(port);
    },
    template: function(args) {
        var opts = {};
        templateQ.forEach(function(v) {
            read(v, function(err, result) {
                if (err) {
                    console.log('获取输入信息失败'.bold.red);
                }
                opts[v.name] = result;
            });
        });

        console.log(opts);
    }
};


function writeFile(path, content) {
    gFile.write(path, content, {
        encoding: 'utf-8'
    });
}