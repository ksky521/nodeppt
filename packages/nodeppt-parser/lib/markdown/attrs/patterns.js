'use strict';
/**
 * If a pattern matches the token stream,
 * then run transform.
 */

const utils = require('./utils.js');

module.exports = options => {
    const __hr = new RegExp(
        '^ {0,3}[-*_]{3,} ?' +
            utils.escapeRegExp(options.leftDelimiter) +
            '[^' +
            utils.escapeRegExp(options.rightDelimiter) +
            ']'
    );

    return [
        {
            /**
             * ```python {.cls}
             * for i in range(10):
             *     print(i)
             * ```
             */
            name: 'fenced code blocks',
            tests: [
                {
                    shift: 0,
                    block: true,
                    info: utils.hasDelimiters('end', options)
                }
            ],
            transform: (tokens, i) => {
                let token = tokens[i];
                let start = token.info.lastIndexOf(options.leftDelimiter);
                let attrs = utils.getAttrs(token.info, start, options);
                utils.addAttrs(attrs, token);
                token.info = utils.removeDelimiter(token.info, options);
            }
        },
        {
            /**
             * bla [:fa-file: abc](http://){.d}
             *
             * differs from 'inline attributes' as it does
             * not have a closing tag (nesting: -1)
             */
            name: 'fa_inline nesting',
            tests: [
                {
                    shift: 0,
                    type: 'inline',
                    children: [
                        {
                            shift: -1,
                            type: 'link_open'
                        },
                        {
                            shift: 0,
                            type: 'fa_inline'
                        },
                        {
                            shift: 1,
                            type: 'text'
                        },
                        {
                            shift: 2,
                            type: 'link_close'
                        },
                        {
                            shift: 3,
                            type: str => str === 'text' || str === 'jsx_inline',
                            content: utils.hasDelimiters('only', options)
                        }
                    ]
                }
            ],
            transform: (tokens, i, j) => {
                const children = tokens[i].children;
                for (let m = 1; m < children.length; m++) {
                    let child = children[m];
                    if (
                        child &&
                        children[m - 1] &&
                        children[m - 1].type === 'link_open' &&
                        child.type === 'fa_inline' &&
                        children[m + 1] &&
                        children[m + 1].type === 'text' &&
                        children[m + 2] &&
                        children[m + 2].type === 'link_close' &&
                        children[m + 3]
                    ) {
                        let jsx = children[m + 3];
                        if (utils.hasDelimiters('start', options)(jsx.content)) {
                            // 说明是有效的 jsx
                            let token = children.splice(m + 3, 1)[0];
                            let attrToken = tokens[i].children[m - 1];
                            let attrs = utils.getAttrs(token.content, 0, options);
                            utils.addAttrs(attrs, attrToken);
                            m--;
                        }
                    }
                }
            }
        },
        {
            /**
             * bla [xxxx](http://){.d}
             *
             * differs from 'inline attributes' as it does
             * not have a closing tag (nesting: -1)
             */
            name: 'inline nesting link',
            tests: [
                {
                    shift: 0,
                    type: 'inline',
                    children: [
                        {
                            shift: 0,
                            type: 'link_open'
                        },
                        {
                            shift: 1,
                            type: 'text'
                        },
                        {
                            shift: 2,
                            type: 'link_close'
                        },
                        {
                            shift: 3,
                            type: str => str === 'text' || str === 'jsx_inline',
                            content: utils.hasDelimiters('only', options)
                        }
                    ]
                }
            ],
            transform: (tokens, i, j) => {
                const children = tokens[i].children;
                // console.log(children[j]);
                for (let m = 1; m < children.length; m++) {
                    let child = children[m];
                    if (
                        child &&
                        children[m - 1] &&
                        children[m - 1].type === 'link_open' &&
                        child.type === 'text' &&
                        children[m + 1] &&
                        children[m + 1].type === 'link_close' &&
                        children[m + 2]
                    ) {
                        let jsx = children[m + 2];
                        if (utils.hasDelimiters('only', options)(jsx.content)) {
                            // 说明是有效的 jsx
                            let token = children.splice(m + 2, 1)[0];
                            let attrToken = tokens[i].children[m - 1];
                            let attrs = utils.getAttrs(token.content, 0, options);
                            utils.addAttrs(attrs, attrToken);
                            m--;
                        }
                    }
                }
            }
        },
        {
            /**
             * bla `click()`{.c} ![](img.png){.d}
             *
             * differs from 'inline attributes' as it does
             * not have a closing tag (nesting: -1)
             */
            name: 'inline nesting 0',
            tests: [
                {
                    shift: 0,
                    type: 'inline',
                    children: [
                        {
                            shift: -1,
                            type: str => str === 'image' || str === 'code_inline'
                        },
                        {
                            shift: 0,
                            type: str => str === 'text' || str === 'jsx_inline',
                            content: utils.hasDelimiters('start', options)
                        }
                    ]
                }
            ],
            transform: (tokens, i, j) => {
                let token = tokens[i].children[j];
                let endChar = token.content.indexOf(options.rightDelimiter);
                let attrToken = tokens[i].children[j - 1];
                let attrs = utils.getAttrs(token.content, 0, options);
                utils.addAttrs(attrs, attrToken);
                if (token.content.length === endChar + options.rightDelimiter.length) {
                    tokens[i].children.splice(j, 1);
                } else {
                    token.content = token.content.slice(endChar + options.rightDelimiter.length);
                }
            }
        },
        {
            /**
             * | h1 |
             * | -- |
             * | c1 |
             * {.c}
             */
            name: 'tables',
            tests: [
                {
                    // let this token be i, such that for-loop continues at
                    // next token after tokens.splice
                    shift: 0,
                    type: 'table_close'
                },
                {
                    shift: 1,
                    type: 'paragraph_open'
                },
                {
                    shift: 2,
                    type: 'inline',
                    content: utils.hasDelimiters('only', options)
                }
            ],
            transform: (tokens, i) => {
                let token = tokens[i + 2];
                let tableOpen = utils.getMatchingOpeningToken(tokens, i);
                let attrs = utils.getAttrs(token.content, 0, options);
                // add attributes
                utils.addAttrs(attrs, tableOpen);
                // remove <p>{.c}</p>
                tokens.splice(i + 1, 3);
            }
        },
        {
            /**
             * *emphasis*{.with attrs=1}
             */
            name: 'inline attributes',
            tests: [
                {
                    shift: 0,
                    type: 'inline',
                    children: [
                        {
                            shift: -1,
                            nesting: -1 // closing inline tag, </em>{.a}
                        },
                        {
                            shift: 0,
                            type: 'text',
                            content: utils.hasDelimiters('start', options)
                        }
                    ]
                }
            ],
            transform: (tokens, i, j) => {
                let token = tokens[i].children[j];
                let content = token.content;
                let attrs = utils.getAttrs(content, 0, options);
                let openingToken = utils.getMatchingOpeningToken(tokens[i].children, j - 1);
                utils.addAttrs(attrs, openingToken);
                token.content = content.slice(content.indexOf(options.rightDelimiter) + options.rightDelimiter.length);
            }
        },
        {
            /**
             * - item
             * {.a}
             */
            name: 'list softbreak',
            tests: [
                {
                    shift: -2,
                    type: 'list_item_open'
                },
                {
                    shift: 0,
                    type: 'inline',
                    children: [
                        {
                            position: -2,
                            type: 'softbreak'
                        },
                        {
                            position: -1,
                            content: utils.hasDelimiters('only', options)
                        }
                    ]
                }
            ],
            transform: (tokens, i, j) => {
                let token = tokens[i].children[j];
                let content = token.content;
                let attrs = utils.getAttrs(content, 0, options);
                let ii = i - 2;
                while (
                    tokens[ii - 1] &&
                    tokens[ii - 1].type !== 'ordered_list_open' &&
                    tokens[ii - 1].type !== 'bullet_list_open'
                ) {
                    ii--;
                }
                utils.addAttrs(attrs, tokens[ii - 1]);
                tokens[i].children = tokens[i].children.slice(0, -2);
            }
        },
        {
            /**
             * - nested list
             *   - with double \n
             *   {.a} <-- apply to nested ul
             *
             * {.b} <-- apply to root <ul>
             */
            name: 'list double softbreak',
            tests: [
                {
                    // let this token be i = 0 so that we can erase
                    // the <p>{.a}</p> tokens below
                    shift: 0,
                    type: str => str === 'bullet_list_close' || str === 'ordered_list_close'
                },
                {
                    shift: 1,
                    type: 'paragraph_open'
                },
                {
                    shift: 2,
                    type: 'inline',
                    content: utils.hasDelimiters('only', options),
                    children: arr => arr.length === 1
                },
                {
                    shift: 3,
                    type: 'paragraph_close'
                }
            ],
            transform: (tokens, i) => {
                let token = tokens[i + 2];
                let content = token.content;
                let attrs = utils.getAttrs(content, 0, options);
                let openingToken = utils.getMatchingOpeningToken(tokens, i);
                utils.addAttrs(attrs, openingToken);
                tokens.splice(i + 1, 3);
            }
        },
        {
            /**
             * - end of {.list-item}
             */
            name: 'list item end',
            tests: [
                {
                    shift: -2,
                    type: 'list_item_open'
                },
                {
                    shift: 0,
                    type: 'inline',
                    children: [
                        {
                            position: -1,
                            content: utils.hasDelimiters('end', options)
                        }
                    ]
                }
            ],
            transform: (tokens, i, j) => {
                let token = tokens[i].children[j];
                let content = token.content;
                let attrs = utils.getAttrs(content, content.lastIndexOf(options.leftDelimiter), options);
                utils.addAttrs(attrs, tokens[i - 2]);
                let trimmed = content.slice(0, content.lastIndexOf(options.leftDelimiter));
                token.content = last(trimmed) !== ' ' ? trimmed : trimmed.slice(0, -1);
            }
        },
        {
            /**
             * something with softbreak
             * {.cls}
             */
            name: '\n{.a} softbreak then curly in start',
            tests: [
                {
                    shift: 0,
                    type: 'inline',
                    children: [
                        {
                            position: -2,
                            type: 'softbreak'
                        },
                        {
                            position: -1,
                            type: str => str === 'text' || str === 'jsx_inline',
                            content: utils.hasDelimiters('only', options)
                        }
                    ]
                }
            ],
            transform: (tokens, i, j) => {
                let token = tokens[i].children[j];
                let attrs = utils.getAttrs(token.content, 0, options);
                // find last closing tag
                let ii = i + 1;
                while (tokens[ii + 1] && tokens[ii + 1].nesting === -1) {
                    ii++;
                }
                let openingToken = utils.getMatchingOpeningToken(tokens, ii);
                utils.addAttrs(attrs, openingToken);
                tokens[i].children = tokens[i].children.slice(0, -2);
            }
        },
        {
            /**
             * horizontal rule --- {#id}
             */
            name: 'horizontal rule',
            tests: [
                {
                    shift: 0,
                    type: 'paragraph_open'
                },
                {
                    shift: 1,
                    type: 'inline',
                    children: arr => arr.length === 1,
                    content: str => str.match(__hr) !== null
                },
                {
                    shift: 2,
                    type: 'paragraph_close'
                }
            ],
            transform: (tokens, i) => {
                let token = tokens[i];
                token.type = 'hr';
                token.tag = 'hr';
                token.nesting = 0;
                let content = tokens[i + 1].content;
                let start = content.lastIndexOf(options.leftDelimiter);
                token.attrs = utils.getAttrs(content, start, options);
                token.markup = content;
                tokens.splice(i + 1, 2);
            }
        },
        {
            /**
             * end of {.block}
             */
            name: 'end of block',
            tests: [
                {
                    shift: 0,
                    type: 'inline',
                    children: [
                        {
                            position: -1,
                            content: utils.hasDelimiters('end', options),
                            type: t => t !== 'code_inline'
                        }
                    ]
                }
            ],
            transform: (tokens, i, j) => {
                let token = tokens[i].children[j];
                let content = token.content;
                let attrs = utils.getAttrs(content, content.lastIndexOf(options.leftDelimiter), options);
                let ii = i + 1;
                while (tokens[ii + 1] && tokens[ii + 1].nesting === -1) {
                    ii++;
                }
                let openingToken = utils.getMatchingOpeningToken(tokens, ii);
                utils.addAttrs(attrs, openingToken);
                let trimmed = content.slice(0, content.lastIndexOf(options.leftDelimiter));
                token.content = last(trimmed) !== ' ' ? trimmed : trimmed.slice(0, -1);
            }
        }
    ];
};

// get last element of array or string
function last(arr) {
    return arr.slice(-1)[0];
}
