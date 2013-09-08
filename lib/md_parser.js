//系统
var fs = require('fs');
var path = require('path');

//非系统
var marked = require('marked');
var grunt = require('grunt');

var gFile = grunt.file;
var gTpl = grunt.template;
var libDir = __dirname;
var rootDir = path.join(libDir, '../');
var assetsDir = path.join(rootDir, 'assets');
var EOL = '\n';
var templateFile = assetsDir + '/markdown.tpl';
var defaultJSON = {
    title: 'nodeppt markdown',
    url: '',
    speaker: '',
    content: '',
    transition: 'zoomout'
};

marked.setOptions({
    gfm: true,

    // silent: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    langPrefix: ''
});

var emptyFn = function(str) {
    console.log(str);
};
var parser = function(string, callback) {
    if (typeof callback !== 'function') {
        callback = emptyFn;
    }
    var contents = string.split('[slide]');
    //第一个是封面
    var cover = contents.shift();
    var json = parseCover(cover);
    var config = require(path.join(libDir, '../package.json'));
    json.nodeppt_version = config.version
    json.nodeppt_site = config.site;
    json = mix(defaultJSON, json);

    var slides = [];
    contents.forEach(function(v) {
        slides.push(parse(marked(v)));
    });
    //合并
    json.content = slides.join(EOL);

    //解析
    var html = fs.readFileSync(templateFile, 'utf-8').toString();
    html = gTpl.process(html, {
        data: json
    });
    callback(html);
    return html;
}
parser.parseCover = parseCover;

module.exports = parser;

/**
 * mix
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */

function mix(obj) {
    var i = 1,
        target, key;

    for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
            }
        }
    }

    return obj;
}
/**
 * 解析cover的json字符串
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */

function parseCover(str) {
    str = str.split(EOL);
    var obj = {};
    var reg = /(\w+)\s?:\s?(.+)/;
    str.forEach(function(val) {
        if (val = reg.exec(val)) {
            obj[val[1]] = val[2];
        }
    });
    return obj;
}

/**
 * 解析 slide内容
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */

function parse(str) {
    var arr = str.split('<hr>');
    var head = '',
        article = '';
    if (arr.length === 2) {
        head = arr[0];
        article = arr[1];
    } else {
        article = str;
    }
    if (head !== '') {
        head = do_attr(head);
        head = '<hgroup>\n' + head + '</hgroup>\n';
    }

    var noHead = !head;
    var articleAttr;
    article = do_attr(article, true, noHead);

    article = '<article>\n' + article + '</article>\n';
    //处理文章只用h1的情况，作为标题页面
    if (noHead && /<h1>.*<\/h1>/g.test(article)) {

        article = article.replace(/<h1>([^<]+)(\s+\{:\&amp;(.+)\})<\/h1>/m, function(input, text, idinput, attrs) {
            articleAttr = parseAttr(idinput, attrs);
            return '<h1>' + text + '</h1>';
        });
        if (!articleAttr) {
            article = article.replace('<article>', '<article class="flexbox vcenter">');
        } else {
            article = article.replace('<article>', '<article ' + articleAttr + '>');
        }
    } else {
        article = article.replace(/<(\w+)>(\s?\{:([^\&].+)\})<\/\1>/gm, function(input, tag, idinput, attrs) {
            articleAttr = parseAttr(idinput, attrs);
            return '';
        });
        if (articleAttr) {
            article = article.replace('<article>', '<article ' + articleAttr + '>');
        }
    }
    var content = head + article;
    var bgimage;
    //背景图片
    if (/[bgimage].*[\/bgimage]/g.test(content)) {
        content = content.replace(/<(\w+)>\[bgimage\](.*)\[\/bgimage(?:\]|<\/a>])+<\/\1>/gm, function(input, tag, image) {
            bgimage = image.replace(/<(.*?)>/g, '');
            return '';
        })
    }

    var tagStart = '<slide class="slide">';
    if (bgimage) {
        tagStart = '<slide class="slide fill" style="background-image:url(' + bgimage + ')">'
    }
    return tagStart + content + '</slide>';
}

function do_attr(str, isArticle, noHead) {
    //input:## Title {:.build width="200px"}
    //output: <h2 class="build" width="200px">Title</h2>
    str = str.replace(/<(\w+)>([^<]+)(\s+\{:([^\&].+)\})<\/\1>/gm, function(input, tag, text, idinput, attrs) {
        var attr = parseAttr(idinput, attrs);
        return '<' + tag + ' ' + attr + '>' + text + '</' + tag + '>';
    });
    str = str.replace(/<(\w+)>([^<]+)<(\w+)>(.+)(\s+\{:\&amp;(.+)\})/mg, function(input, parentTag, parentText, childTag, childText, idinput, attrs) {
        var attr = parseAttr(idinput, attrs);
        return '<' + parentTag + ' ' + attr + '>' + parentText + '<' + childTag + '>' + childText;
    });

    return str;
}

function parseAttr(idinput, attrs) {
    attrs = attrs.split(' ');
    // console.log(attrs);
    var attrArr = [];
    var idArr = [],
        classArr = [];
    attrs.forEach(function(attr) {
        if ( !! ~attr.indexOf('=')) {
            attrArr.push(attr);
        } else if (attr) {
            var ids = attr.split(/[#|.]/);
            // console.log(attr);
            ids.forEach(function(v) {
                if (v !== '') {
                    (new RegExp('\\#' + v)).test(idinput) && idArr.push(v);
                    (new RegExp('\\.' + v)).test(idinput) && classArr.push(v);
                }
            });
        }
    });

    var attr = '';
    var arr = [];
    if (idArr.length > 0) {
        arr.push('id="' + idArr.join(' ') + '"');

    }
    if (classArr.length > 0) {
        arr.push('class="' + classArr.join(' ') + '"');
    }
    if (attrArr.length > 0) {
        arr.push(attrArr.join(' '));

    }
    attr = arr.join(' ').replace(/&#39;/g, '\'')
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');
    return attr;
}
///test
// var str = fs.readFileSync('../test/basic.md').toString();

// parser(str);