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

        console.log('     ________________|'.bold.green + 'nodePPT帮助'.bold.red + '|_______________'.bold.green);
        console.log('    |                                            |'.bold.green);
        console.log('    |   nodeppt start: 启动服务                  |'.bold.green);
        console.log('    |   nodeppt start -p 8000: 启动8000端口      |'.bold.green);
        console.log('    |   nodeppt start -p 8000 -d ./              |'.bold.green);
        console.log('    |   nodeppt create fileName: 创建一个ppt     |'.bold.green);
        console.log('    |____________________________________________|'.bold.green);
    },
    start: function(args) {
        //启动
        var port = 8080;
        var dir = '';
        var self = this;
        for (var i = 0, len = args.length; i < len; i++) {
            switch (args[i]) {
                case '--port':
                    port = args[i + 1] ? args[i + 1] : 8080;
                    i++;
                    break;
                case '--dir':
                    dir = args[i + 1] ? args[i + 1] : null;
                    i++;
                    break;
            }
        }

        if (!fs.existsSync(dir)) {
            dir = join(self.cwd, dir);
            if (!fs.existsSync(dir)) {

                return console.log('\nERROR: '.bold.red + dir + ' 不是一个正确路径');
            }

        } else {
            var stat = fs.statSync(dir);
            if (!stat.isDirectory()) {
                return console.log('\nERROR: '.bold.red + dir + ' 不是一个正确路径');
            }
        }

        require(libDir + '/server').start(port, dir);
    },
    create: function(args) {
        var curRoot = process.cwd();
        for (var i = 0, len = args.length; i < len; i++) {
            switch (args[i]) {
                case '--dir':
                    curRoot = args[i + 1] ? args[i + 1] : null;
                    i++;
                    break;
                default:
                    filename = args[i];
            }
        }

        var opts = {};
        filename = filename.replace(/\.htm[l]?$/, '');

        console.log(filename, curRoot);

        if (filename !== '') {
            if (gFile.exists(join(curRoot, filename + '.html'))) {
                console.log('ERROR: '.bold.red + '"' + filename + '" 已经存在！');
                return false;
            }
            opts.filename = filename;
            opts.filepath = join(curRoot, filename + '.html');

            templateQ.splice(0, 1);
        } else {
            console.log('ERROR: '.bold.red + '请输入一个名字！');
            return false;
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

    writeFile(opts.filepath, html);
    console.log(('已经成功创建文件：' + opts.filename + '.html, 请继续编写您的幻灯片内容').bold.green);
}

function writeFile(path, content) {
    gFile.write(path, content, {
        encoding: 'utf-8'
    });
}