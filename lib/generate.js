var fs = require('fs');
var path = require('path');

var md_parser = require('./md_parser');
var $ = require('./helper');

module.exports = {
    dir: function(destDir, outputDir) {
        outputDir = $.isDir(outputDir, true) ? outputDir : $.getDirPath(path.join(process.cwd(), './publish'));
        destDir = $.getDirPath(destDir);
        console.log(destDir, outputDir);
    },
    output: function(filename) {
        var html = parser(filename);

    }
};

function parser(realPath) {
    if (fs.existsSync(realPath)) {
        var content = fs.readFileSync(realPath, 'utf-8').toString();
        try {
            var html = md_parser(content, function() {});
            return html;
        } catch (e) {
            console.log('ERROR: '.bold.red + e.toString());
        }
    } else {
        console.log('ERROR: '.bold.red + realPath + ' is not exists!');
    }
    return false;
}
