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
    prompt: 'filename'.bold.green,
    'default': 'demo'
}, {
    name: 'title',
    prompt: 'title'.bold.green,
    'default': 'slide title'
}, {
    name: 'subtitle',
    prompt: 'subtitle'.bold.green,
    'default': ''
}, {
    name: 'speaker',
    prompt: 'speaker'.bold.green,
    'default': 'speaker'
}];
var ppt = module.exports = {
    pdf: function (args) {
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
        child.stderr.on('data', function (data) {
            console.log('please install phantomjs：npm install -g phantomjs'.red);
            console.log('nodeppt pdf depend phantomjs '.red);
        });
        child.stdout.on('data', function (data) {
            console.log(data);
        });
    },
    start: function (argsObj) {
        //启动
        var curRoot = process.cwd();

        var dir = argsObj.dir;
        if (dir === '') {
            dir = curRoot; //path.join(rootDir, 'ppts');
        }

        if (!fs.existsSync(dir)) {
            dir = path.join(curRoot, dir);
            if (!fs.existsSync(dir)) {
                return console.log('\nERROR: '.bold.red + dir + ' not a right path');
            }

        } else {
            var stat = fs.statSync(dir);
            if (!stat.isDirectory()) {
                return console.log('\nERROR: '.bold.red + dir + ' not a right path');
            }
        }

        require(libDir + '/server').start(argsObj.port, dir, argsObj.host, argsObj);
    },
    create: function (filename, options) {
        var curRoot = process.cwd();

        if (options && options.dir) {
            curRoot = options.dir;
        }

        var opts = {
            isHTML: false
        };

        if (filename) {
            filename = filename.replace(/\.htm[l]?$/, '');
            opts.isHTML = /\.htm[l]?$/.test(filename);
            opts.filepath = opts.isHTML ? path.join(curRoot, filename + '.html') : path.join(curRoot, filename + '.md');

            if ($.exists(opts.filepath)) {
                console.log('ERROR: '.bold.red + ' ' + filename + ' already exist！');
                return false;
            }
            opts.filename = filename;

            templateQ.splice(0, 1);
        }
        console.log('please input：'.bold.green);
        (function next(prompt) {
            if (!prompt) {
                return doneTmpl(opts);
            }

            read(prompt, function (err, value) {
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
    generate: function (filename, output, all, rDir) {
        require(libDir + '/generate')(filename, output, all, rDir);
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
    console.log(('Success：' + opts.filename + (opts.isHTML ? '.html' : '.md') + ', please write your slide content').bold.green);
}
