//系统
var fs = require('fs');
var path = require('path');

//非系统
var marked = require('./marked');
var $ = require('./helper');
var libDir = __dirname;
var rootDir = path.join(libDir, '../');
var assetsDir = path.join(rootDir, 'assets') + path.sep;
var templateDir = path.join(rootDir, 'template') + path.sep;
var EOL = '\n';
var templateFile = templateDir + 'markdown.ejs';
var defaultJSON = {
    title: 'nodeppt markdown',
    url: '',
    speaker: '',
    content: '',
    transition: 'kontext',
    files: '',
    highlightStyle: 'monokai_sublime'
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
    // console.log(str);
};
var parser = function(string, callback, argvObj, queryObj, commonData) {
    if (typeof callback !== 'function') {
        callback = emptyFn;
    }
    var splitReg = /\[slide\s*(.*)\]/ig;
    var slidesSetting = string.match(splitReg);
    var contents = string.split(/\[slide.*\]/i);
    // console.log(contents.length, slidesSetting);
    //第一个是封面
    var cover = contents.shift();
    var json = parseCover(cover);
    json = mix({}, json, commonData);
    var config = require(path.join(libDir, '../package.json'));
    json.nodeppt_version = config.version;
    json.nodeppt_site = config.site;
    json = mix({}, defaultJSON, json, {
        query: mix(queryObj || {}, argvObj || {})
    });
    if (json.files) {
        var files = json.files.split(/\s?,\s?/);
        json.files = files.map(function(v) {
            if (/.js$/i.test(v)) {
                //js文件
                return '<script src="' + v + '"></script>';
            } else if (/.css$/i.test(v)) {
                //css文件
                return '<link rel="stylesheet" href="' + v + '">';
            }
            return v;
        }).join(EOL);
    }
    var slides = [];
    var noteReg = /\[note\]([\s\S]+)\[\/note\]/im;
    contents.forEach(function(v, i) {
        var cfg = slidesSetting[i];
        cfg = cfg.match(/\[slide\s+(.+)\s?\]/);
        var attrs = '';
        if (cfg) {
            attrs = cfg[1];
        }
        var note = noteReg.exec(v);
        if (note) {
            v = v.replace(noteReg, '');
            note = marked(note[1]);
        }
        var content = marked(v);

        slides.push(parse(content, note, attrs));
    });
    //合并
    json.content = slides.join(EOL);

    //解析
    html = $.renderFile(templateFile, json);
    callback(html);
    return html;
};
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
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
            if (hasOwnProperty.call(target, key)) {
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
 * @param  {[type]} str   [description]
 * @param  {[type]} note  [description]
 * @param  {[type]} sAttrs [description]
 * @return {[type]}       [description]
 */

function parse(str, note, sAttrs) {
    var arr = str.split('<hr>');
    var head = '',
        article = '';
    if (note && note.length > 3) {
        note = ['<aside class="note">', '<section>', note, '</section>', '</aside>'].join(EOL);
    } else {
        note = '';
    }
    if (arr.length === 2) {
        head = arr[0];
        article = arr[1];
    } else {
        article = str;
    }
    if (head !== '') {
        head = doAttr(head);
        head = ['<hgroup>', head, '</hgroup>'].join(EOL);
    }

    var noHead = !head;
    var articleAttr;
    article = doAttr(article, true, noHead);

    article = ['<article>', article, '</article>'].join(EOL);
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
        article = article.replace(/<(\w+)>(\s?\{:(?:\&amp;)?([^\&].+)\})<\/\1>/gm, function(input, tag, idinput, attrs) {
            articleAttr = parseAttr(idinput, attrs);
            return '';
        });
        if (articleAttr) {
            article = article.replace('<article>', '<article ' + articleAttr + '>');
        }
    }
    article = article.replace('<p></p>', '');
    var content = head + article;

    var tagStart = '<slide class="slide">';
    if (sAttrs) {
        var cls = sAttrs.match(/class=['"]?([^'"]+)['"]?/);
        if (cls) {
            cls = cls[1] + ' slide';
            sAttrs = sAttrs.replace(cls[0], '');
        } else {
            cls = 'slide';
        }
        if (/background/.test(sAttrs)) {
            cls += ' fill';
        }
        tagStart = '<slide class="' + cls + '" ' + sAttrs + '>';
        // console.log(tagStart);
    }
    return tagStart + note + '<section class="slide-wrapper">' + content + '</section></slide>';
}

function doAttr(str, isArticle, noHead) {
    //input:## Title {:.build width="200px"}
    //output: <h2 class="build" width="200px">Title</h2>

    str = str.replace(/<(\w+)([^>]*)>([^<]+)(\s+\{:([^\&].+)\})<\/\1>/gm, function(input, tag, pre, text, idinput, attrs) {
        var attr = parseAttr(idinput, attrs);
        attr = mergeAttr(pre, attr);
        return '<' + tag + ' ' + attr + '>' + text + '</' + tag + '>';
    });
    str = str.replace(/<(\w+)>([^<]+)<(\w+)>(.+)(\s+\{:\&amp;(.+)\})/mg, function(input, parentTag, parentText, childTag, childText, idinput, attrs) {
        var attr = parseAttr(idinput, attrs);
        return '<' + parentTag + ' ' + attr + '>' + parentText + '<' + childTag + '>' + childText;
    });

    return str;
}

function mergeAttr(oldAttr, newAttr) {
    if (!oldAttr) {
        return newAttr;
    }
    if (!newAttr) {
        return oldAttr;
    }
    //合并class style
    var oldAttrs = String(oldAttr).split(/\s+/);
    var newAttrs = String(newAttr).split(/\s+/);
    var old = {},
        inew = {};
    var back = [];
    oldAttrs.forEach(function(a) {
        var v = a.split('=');
        v[0] = v[0].toLowerCase();
        if (v[0] === 'class' || v[0] === 'style') {
            old[v[0]] = v[1].slice(1, -1).trim();
        } else {
            back.push(a);
        }
    });
    newAttrs.forEach(function(a) {
        var v = a.split('=');
        v[0] = v[0].toLowerCase();
        if (v[0] === 'class' || v[0] === 'style') {
            inew[v[0]] = v[1].slice(1, -1).trim();
        } else {
            back.push(a);
        }
    });
    ['class', 'style'].forEach(function(v) {
        //两个都存在，则合并之
        switch (v) {
            case 'class':
                back.push('class="' + [old[v] || '', inew[v] || ''].join(' ').trim() + '"');
                break;
            case 'style':
                back.push('style="' + [old[v] || '', inew[v] || ''].join(';') + '"');
                break;
        }
    });
    return back.join(' ');
}

function parseAttr(idinput, attrs) {
    attrs = attrs.split(/\s+/);
    // console.log(attrs);
    var attrArr = [];
    var idArr = [],
        classArr = [];
    attrs.forEach(function(attr) {
        if (!!~attr.indexOf('=')) {
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
// var str = fs.readFileSync('ppts/demo.md').toString();

// parser(str);
