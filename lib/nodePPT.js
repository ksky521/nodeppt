var fs = require('fs');
var path = require('path');

var color = require('colors');
var read = require('read');
var exec = require('child_process').exec;

var $ = require('./helper');

var libDir = __dirname;
var rootDir = path.join(libDir, '../');
var templateDir = path.join(rootDir, 'template') + path.sep;

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
    pdf: function(args) {
        var self = this;
        var url = args[0];
        var output = args[1] ? args[1] : '';

        if (!url) {
            console.log('ERROR: pdf need a URL'.bold.red);
            ppt.help('pdf');
            return;
        }
        if (output === '') {
            output = 'nodeppt.pdf';
        }
        if (output.slice(-4) !== '.pdf') {
            output += '.pdf';
        }
        var child = exec('phantomjs ' + libDir + '/pdf.js ' + url + ' ' + output);
        // child.stderr.setEncoding('utf8');
        child.stderr.on('data', function(data) {
            console.log('请安装phantomjs：npm install -g phantomjs'.red);
            console.log('nodeppt pdf 功能需要 phantomjs 支持'.red);
        });
        child.stdout.on('data', function(data) {
            console.log(data);
        });
    },
    '--version': function() {
        console.log('v' + require('../package.json').version);
    },
    help: function(command) {
        switch (command) {
            case undefined:
                console.log('\n 用法: nodeppt <command>\n');
                console.log(' 命令:');
                console.log('   start     启动nodeppt httpserver');
                console.log('   create    创建一个ppt');
                console.log('   generate  导出ppt为一个html文件，-a：导出全部文件');
                console.log('   pdf       导出网页ppt为pdf文件\n');

                console.log(' 选项:');
                console.log('   -h        帮助');
                console.log('   -v        版本信息\n');
                console.log(' 查看命令帮助: nodeppt <command> -h');
                console.log(' Example: nodeppt start -h 查看start命令帮助');
                break;
            case 'start':
                console.log('\n 用法: nodeppt start [OPTION]');
                console.log('   -d, --dir <ppt_path>       指定ppt的路径');
                console.log('   -p, --port <port>          指定httpserver端口');
                console.log('   -c, --controller <socket>  支持websocket双屏控制');
                console.log('   -H, --host <host>          httpserver绑定的host\n');
                console.log(' Example: ');
                console.log('   nodeppt start -d D:/webppt -p 8080');
                console.log('   nodeppt start -d D:/webppt -c socket');
                break;
            case 'pdf':
                console.log('\n 用法: nodeppt pdf <http_url> <save_path.pdf>\n');
                console.log(' Example: ');
                console.log('   nodeppt pdf http://127.0.0.1:8080/md/demo.md demo.pdf\n');
                console.log(' 注意: '.bold.red + '此功能需要安装phantomjs');
                console.log('   npm install -g phantomjs');
                break;
            case 'generate':
                console.log('\n 用法: nodeppt generate <file_path> <save_path>');
                console.log('   -o, --output <save_path>   指定导出路径和文件名');
                console.log('   -a, --all                  导出全部(包括nodeppt js和css)\n');
                console.log(' Example: ');
                console.log('   nodeppt generate D:/webppt/demo.md -o D:/output\n');
                break;
            case 'create':
                console.log('\n 用法: nodeppt create <filename> [OPTION]');
                console.log('   -d, --dir <ppt_path>       指定ppt的路径\n');
                console.log(' Example: ');
                console.log('   nodeppt create myslide');
                console.log('   nodeppt create myslide -d D:/webppt');
                break;
        }
        // console.log('     ________________|'.bold.green + 'nodePPT帮助'.bold.red + '|_______________'.bold.green);
        // console.log('    |                                            |'.bold.green);
        // console.log('    |   nodeppt start: 启动httpserver            |'.bold.green);
        // console.log('    |   nodeppt start -p 8000: 启动8000端口      |'.bold.green);
        // console.log('    |   nodeppt start -p 8000 -d ./ 指定路径     |'.bold.green);
        // console.log('    |   nodeppt start -h 127.0.0.1 指定host      |'.bold.green);
        // console.log('    |   nodeppt start -c socket 用socket双屏控制 |'.bold.green);
        // console.log('    |   nodeppt create fileName: 创建一个ppt     |'.bold.green);
        // console.log('    |   nodeppt pdf url -o a.pdf: 输出一个pdf    |'.bold.green);
        // console.log('    |   nodeppt generate path: 输导出html        |'.bold.green);
        // console.log('    |____________________________________________|'.bold.green);
    },
    start: function(args) {
        //启动
        var self = this;
        var argsObj = {
            port: 8080,
            dir: '',
            host: '0.0.0.0',
            file: ''
        };
        args = args.join(' ').split('--');
        args.forEach(function(v, i) {
            v = v.trim();
            if (v !== '') {
                v = v.split(/\s+/);
                if (v.length === 2) {
                    argsObj[v[0]] = v[1];
                }
            }
        });
        // console.log(argsObj);

        var dir = argsObj.dir;
        if (dir === '') {
            dir = path.join(rootDir, 'ppts');
        }

        if (!fs.existsSync(dir)) {
            dir = path.join(self.cwd, dir);
            if (!fs.existsSync(dir)) {
                return console.log('\nERROR: '.bold.red + dir + ' 不是一个正确路径');
            }

        } else {
            var stat = fs.statSync(dir);
            if (!stat.isDirectory()) {
                return console.log('\nERROR: '.bold.red + dir + ' 不是一个正确路径');
            }
        }

        require(libDir + '/server').start(argsObj.port, dir, argsObj.host, argsObj);
    },
    create: function(args) {
        var curRoot = process.cwd();
        var filename = '';
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

        var opts = {
            isHTML: false
        };

        if (filename) {
            filename = filename.replace(/\.htm[l]?$/, '');
            opts.isHTML = /\.htm[l]?$/.test(filename);
            opts.filepath = opts.isHTML ? path.join(curRoot, filename + '.html') : path.join(curRoot, filename + '.md');

            if ($.exists(opts.filepath)) {
                console.log('ERROR: '.bold.red + ' ' + filename + ' 已经存在！');
                return false;
            }
            opts.filename = filename;

            templateQ.splice(0, 1);
        } else {
            console.log('ERROR: 请输入一个名字！'.bold.red);
            ppt.help('create');
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
    },
    // init: function(args) {
    //     var curRoot = process.cwd();
    //     for (var i = 0, len = args.length; i < len; i++) {
    //         switch (args[i]) {
    //             case '--dir':
    //                 curRoot = args[i + 1] ? args[i + 1] : null;
    //                 i++;
    //                 break;
    //                 // default:
    //                 // filename = args[i];
    //         }
    //     }
    //     if ($.isDir(curRoot)) {
    //         require(libDir + '/init')(curRoot);
    //     }
    // },
    generate: function(args) {
        var curRoot = process.cwd();
        var filename = '';
        var output = '';
        var all = false;
        for (var i = 0, len = args.length; i < len; i++) {
            switch (args[i]) {
                case '--all':
                    all = true;
                    break;
                default:
                    filename = output;
                    output = args[i];
            }
        }
        if (!filename) {
            filename = output;
            output = '';
        }
        output = output ? output : process.cwd();
        filename = filename ? filename : process.cwd();

        require(libDir + '/generate')(filename, output, all);
    }
};

function doneTmpl(opts) {
    if (opts.filename === '') {
        opts.filename = Date.now();
    }
    var json = require(path.join(libDir, '../package.json'));
    opts.version = json.version;
    opts.site = json.site;

    var html = $.renderFile(templateDir + (opts.isHTML ? 'default.ejs' : 'defaultmd.ejs'), opts);

    $.writeFile(opts.filepath, html);
    console.log(('已经成功创建文件：' + opts.filename + (opts.isHTML ? '.html' : '.md') + ', 请继续编写您的幻灯片内容').bold.green);
}
