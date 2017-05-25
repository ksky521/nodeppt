#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var nodePPT = require('../lib/nodePPT');
var versions = require('../package').version;
var program = require('commander');
var ipv4 = require('ipv4');
if (process.argv[2] && process.argv[2] === '-v') {
    process.argv[2] = '-V';
}
program
    .version(versions);

program
    .command('create')
    .alias('new')
    .usage('[filename] [option]')
    .description('create a slide')
    .option('-d, --dir [path]', 'set slide file destination path')
    .action(function (filename, options) {
        if (typeof filename === 'object') {
            console.log('ERROR: please input filename！'.bold.red);
            this.outputHelp();
            return;
        }

        nodePPT.create(filename, options)
    }).on('--help', function () {
        console.log('  Examples:');
        console.log();
        console.log('  nodeppt create myslide');
        console.log('  nodeppt create myslide -d D:/webppt');
        console.log();
    });

function assetPathWarn(){
    console.warn('The asset-path params will be ignored when output all files.');
}

program
    .command('generate')
    .alias('release')
    .usage('[file_path] [save_path]')
    .description('export html file')
    .option('-a, --all [false]', 'output all style(include js,css) file', false)
    .option('-p, --asset-path [path]','set the relative path of html to assets(in website), ignored when -a is specified','.')
    .action(function (cmd, output, options) {
        var filename = '';
        var shouldAll = false;
        var path = '';
        if (typeof output !== 'string') {
            options = output;
            output = undefined;
        }

        if (typeof cmd === 'string') {
            filename = cmd;
            shouldAll = options.all;
            if (options.assetPath && shouldAll ) {
                assetPathWarn();
            } else {
                path = options.assetPath;
            }
        } else if (typeof cmd === 'object') {
            shouldAll = cmd.all;
            output = cmd.output;
            if (cmd.assetPath && shouldAll ) {
                assetPathWarn();
            } else {
                path = cmd.assetPath;
            }
        }

        nodePPT.generate(filename, output, shouldAll, path || '');
    })
    .on('--help', function () {
        console.log('  Examples:');
        console.log();
        console.log('  nodeppt generate /markdown/path.md /output/path');
        console.log('  nodeppt generate /markdown/path.md /output/path -a');
        console.log('  nodeppt generate /markdown/path.md /output/path -p ../lib/nodeppt');
        console.log();
    });


program
    .command('start')
    .description('start local sever show slide')
    .option('-d, --dir [dir]', 'set slide path', '')
    .option('-p, --port [port]', 'set server port ', 8080)
    .option('-c, --controller [socket]', 'support websocket mutil screen controller')
    .option('-H, --host [host]', 'set host address', ipv4 || '0.0.0.0')
    .option('-w, --watch', 'livereload')
    .action(function (cmd) {
        if (typeof cmd !== 'object') {
            this.outputHelp();
            return;
        }

        nodePPT.start(cmd)
    })
    .on('--help', function () {
        console.log('  Examples:');
        console.log();
        console.log('  nodeppt start -d D:/webppt -p 8080');
        console.log('  nodeppt start -d D:/webppt -c socket');
        console.log();
    });


program
    .command('pdf')
    .description('export pdf file. ' + 'Deprecated'.bold.red)
    .action(function (http_url, save_path) {
        console.log('  Warning: '.bold.red + 'This command has been ' + 'Removed'.bold.red);
    })
    .on('--help', function () {
        console.log(' Warning: '.bold.red + 'This command has been ' + 'Removed'.bold.red);
    });



program.parse(process.argv);


if (!program.args[0]) {
    process.stdout.write(program.helpInformation());
    program.emit('--help');
}
