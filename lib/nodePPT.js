var fs = require('fs');
var path = require('path');
var join = path.join;
var grunt = require('grunt');
var gFile = grunt.file;
var gTpl = grunt.template;
var color = require('colors');
var read = require('read');

var libDir = __dirname;
var rootDir = join(libDir, '../');
var templateHTML = libDir + '/template.html';
var templateQ = [{
    name: 'filename',
    prompt: 'html文件名称'.bold.green,
    'default': 'demo'
}, {
    name: 'title',
    prompt: '演讲题目'.bold.green,
    'default': '演讲题目'
}, {
    name: 'subtitle',
    prompt: '副标题'.bold.green,
    'default': ''
}, {
    name: 'speaker',
    prompt: '演讲者'.bold.green,
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
        var filename = args.slice(-1).toString();
        if (filename !== '') {
            if (gFile.exists(rootDir + '/ppts/' + filename + '.html')) {
                console.log('ERROR: '.bold.red+'"'+filename+'" 已经存在！');
            }
            opts.filename = filename;
            templateQ.splice(0, 1);
        }

        console.log('请回答以下问题：'.bold.green);
        var v = templateQ.unshift();
        (function next(prompt) {
            if (!prompt) {
                return doneTmpl(opts);
            }

            read(prompt, function(err, value) {
                if (err) {
                    return console.log('\nERROR: '.bold.red + '获取 "' + prompt.name + '" 输入信息失败');
                }
                opts[prompt.name] = value;
                next(templateQ.shift());
            });
        })(templateQ.shift());

    }
};

function doneTmpl(opts) {
    if (opts.filename === '') {
        opts.filename = Date.now();
    }
    var html = fs.readFileSync(templateHTML, 'utf-8').toString();
    var json = require(join(libDir, '../package.json'));
    opts.version = json.version;
    opts.site = json.site;
    html = gTpl.process(html, {
        data: opts
    });

    writeFile(join(rootDir, './ppts/' + opts.filename + '.html'), html);
    console.log(('已经成功创建文件：' + opts.filename + '.html, 请继续编写您的幻灯片内容').bold.green);
}

function writeFile(path, content) {
    gFile.write(path, content, {
        encoding: 'utf-8'
    });
}