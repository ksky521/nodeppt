'use strict';
exports.findAttrs = (attrArray, name, getValueOnly = true) => {
    let rs = (attrArray || []).find(([key, value]) => {
        if (key === name) {
            return true;
        }
        return false;
    });
    if (getValueOnly) {
        return rs[1];
    }
    return rs;
};
/**
 * parse {.class #id key=val} strings
 * @param {string} str: string to parse
 * @param {int} start: where to start parsing (including {)
 * @returns {2d array}: [['key', 'val'], ['class', 'red']]
 */
exports.getAttrs = function(str, start, options) {
    // not tab, line feed, form feed, space, solidus, greater than sign, quotation mark, apostrophe and equals sign
    const allowedKeyChars = /[^\t\n\f />"'=]/;
    const pairSeparator = ' ';
    const keySeparator = '=';
    const classChar = '.';
    const idChar = '#';

    const attrs = [];
    let key = '';
    let value = '';
    let parsingKey = true;
    let valueInsideQuotes = false;

    // read inside {}
    // start + left delimiter length to avoid beginning {
    // breaks when } is found or end of string
    for (let i = start + options.leftDelimiter.length; i < str.length; i++) {
        if (str.slice(i, i + options.rightDelimiter.length) === options.rightDelimiter) {
            if (key !== '') {
                attrs.push([key, value]);
            }
            break;
        }
        let char_ = str.charAt(i);

        // switch to reading value if equal sign
        if (char_ === keySeparator && parsingKey) {
            parsingKey = false;
            continue;
        }

        // {.class} {..css-module}
        if (char_ === classChar && key === '') {
            // console.log(str)
            if (str.charAt(i + 1) === classChar) {
                key = 'css-module';
                i += 1;
            } else {
                key = 'class';
            }
            parsingKey = false;
            continue;
        }

        // {#id}
        if (char_ === idChar && key === '') {
            key = 'id';
            parsingKey = false;
            continue;
        }

        // {value="inside quotes"}
        if (char_ === '"' && value === '') {
            valueInsideQuotes = true;
            continue;
        }
        if (char_ === '"' && valueInsideQuotes) {
            valueInsideQuotes = false;
            continue;
        }

        // read next key/value pair
        if (char_ === pairSeparator && !valueInsideQuotes) {
            if (key === '') {
                // beginning or ending space: { .red } vs {.red}
                continue;
            }
            attrs.push([key, value]);
            key = '';
            value = '';
            parsingKey = true;
            continue;
        }

        // continue if character not allowed
        if (parsingKey && char_.search(allowedKeyChars) === -1) {
            continue;
        }

        // no other conditions met; append to key/value
        if (parsingKey) {
            key += char_;
            continue;
        }
        value += char_;
    }
    return attrs;
};

/**
 * add attributes from [['key', 'val']] list
 * @param {array} attrs: [['key', 'val']]
 * @param {token} token: which token to add attributes
 * @returns token
 */
exports.addAttrs = function(attrs, token) {
    for (let j = 0, l = attrs.length; j < l; ++j) {
        let key = attrs[j][0];
        // 多个. 支持
        if (key === 'class') {
            token.attrJoin('class', attrs[j][1].split('.').join(' '));
        } else if (key === 'css-module') {
            token.attrJoin('css-module', attrs[j][1].split('.').join(' '));
        } else {
            token.attrPush(attrs[j]);
        }
    }
    return token;
};
// 增加获取 attr string 方法
exports.getAttrsString = function(attrs, fn) {
    const defFN = (key, value) => `${key}="${value}"`;
    const cb =
        typeof fn === 'function'
            ? (key, value) => {
                  const r = fn(key, value);
                  if (r) {
                      return r;
                  } else {
                      return defFN(key, value);
                  }
              }
            : (key, value) => `${key}="${value}"`;
    const str = [];
    for (let j = 0, l = attrs.length; j < l; ++j) {
        let key = attrs[j][0];
        // 多个. 支持
        if (key === 'class' || key === 'css-module') {
            str.push(cb(key, attrs[j][1].split('.').join(' ')));
        } else {
            str.push(cb(key, attrs[j][1]));
        }
    }
    return str.join(' ');
};

/**
 * Does string have properly formatted curly?
 *
 * start: '{.a} asdf'
 * middle: 'a{.b}c'
 * end: 'asdf {.a}'
 * only: '{.a}'
 *
 * @param {string} where to expect {} curly. start, middle, end or only.
 * @return {function(string)} Function which testes if string has curly.
 */
exports.hasDelimiters = function(where, options) {
    if (!where) {
        throw new Error('Parameter `where` not passed. Should be "start", "middle", "end" or "only".');
    }

    /**
     * @param {string} str
     * @return {boolean}
     */
    return function(str) {
        // we need minimum three chars, for example {b}
        let minCurlyLength = options.leftDelimiter.length + 1 + options.rightDelimiter.length;
        if (!str || typeof str !== 'string' || str.length < minCurlyLength) {
            return false;
        }

        function validCurlyLength(curly) {
            let isClass = curly.charAt(options.leftDelimiter.length) === '.';
            let isId = curly.charAt(options.leftDelimiter.length) === '#';
            return isClass || isId ? curly.length >= minCurlyLength + 1 : curly.length >= minCurlyLength;
        }

        let start, end, slice, nextChar;
        let rightDelimiterMinimumShift = minCurlyLength - options.rightDelimiter.length;
        switch (where) {
            case 'start':
                // first char should be {, } found in char 2 or more
                slice = str.slice(0, options.leftDelimiter.length);
                start = slice === options.leftDelimiter ? 0 : -1;
                end = start === -1 ? -1 : str.indexOf(options.rightDelimiter, rightDelimiterMinimumShift);
                // check if next character is not one of the delimiters
                nextChar = str.charAt(end + options.rightDelimiter.length);
                if (nextChar && options.rightDelimiter.indexOf(nextChar) !== -1) {
                    end = -1;
                }
                break;

            case 'end':
                // last char should be }
                start = str.lastIndexOf(options.leftDelimiter);
                end = start === -1 ? -1 : str.indexOf(options.rightDelimiter, start + rightDelimiterMinimumShift);
                end = end === str.length - options.rightDelimiter.length ? end : -1;
                break;

            case 'only':
                // '{.a}'
                slice = str.slice(0, options.leftDelimiter.length);
                start = slice === options.leftDelimiter ? 0 : -1;
                slice = str.slice(str.length - options.rightDelimiter.length);
                end = slice === options.rightDelimiter ? str.length - options.rightDelimiter.length : -1;
                break;
        }

        return (
            start !== -1 && end !== -1 && validCurlyLength(str.substring(start, end + options.rightDelimiter.length))
        );
    };
};
let latestOptions = {};
exports.setOptions = opts => {
    latestOptions = opts;
};
exports.getOptions = () => {
    return latestOptions;
};
/**
 * Removes last curly from string.
 */
exports.removeDelimiter = function(str, options) {
    const start = escapeRegExp(options.leftDelimiter);
    const end = escapeRegExp(options.rightDelimiter);

    let curly = new RegExp('[ \\n]?' + start + '[^' + start + end + ']+' + end + '$');
    let pos = str.search(curly);

    return pos !== -1 ? str.slice(0, pos) : str;
};

/**
 * Escapes special characters in string s such that the string
 * can be used in `new RegExp`. For example "[" becomes "\\[".
 *
 * @param {string} s Regex string.
 * @return {string} Escaped string.
 */
function escapeRegExp(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
exports.escapeRegExp = escapeRegExp;

/**
 * find corresponding opening block
 */
exports.getMatchingOpeningToken = function(tokens, i) {
    if (tokens[i].type === 'softbreak') {
        return false;
    }
    // non closing blocks, example img
    if (tokens[i].nesting === 0) {
        return tokens[i];
    }

    // inline tokens changes level on same token
    // that have .nesting +- 1
    let level = tokens[i].block ? tokens[i].level : tokens[i].level + 1; // adjust for inline tokens

    let type = tokens[i].type.replace('_close', '_open');

    for (; i >= 0; --i) {
        if (tokens[i].type === type && tokens[i].level === level) {
            return tokens[i];
        }
    }
};

/**
 * from https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js
 */
let HTML_ESCAPE_TEST_RE = /[&<>"]/;
let HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
let HTML_REPLACEMENTS = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
};

function replaceUnsafeChar(ch) {
    return HTML_REPLACEMENTS[ch];
}

exports.escapeHtml = function(str) {
    if (HTML_ESCAPE_TEST_RE.test(str)) {
        return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
    }
    return str;
};
