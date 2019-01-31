const utils = require('../attrs/utils');
const attrOptions = utils.getOptions();
const name = 'card';

module.exports = {
    validate(params) {
        return params.trim().match(new RegExp('^' + name + '(-\\d+)?\\s*(.*)$'));
    },
    handler(state, opts, start) {
        function getOpenToken(tag, level) {
            const token = new state.Token('container_' + name + '_' + tag + '_open', tag, 1);
            token.block = true;
            token.level = 1 + level;
            return token;
        }
        function getCloseToken(tag, level) {
            const token = new state.Token('container_' + name + '_' + tag + '_close', tag, -1);
            token.block = true;
            token.level = 1 + level;
            return token;
        }
        function hasImg(tokens) {
            if (
                tokens.length === 3 &&
                tokens[0].type === 'paragraph_open' &&
                tokens[2].type === 'paragraph_close' &&
                /^\!\[/.test(tokens[1].content)
            ) {
                return [
                    getOpenToken('figure', tokens[0].level - 1),
                    tokens[1],
                    getCloseToken('figure', tokens[2].level - 1)
                ];
            }
            return false;
        }

        opts = opts.split(/card(?:-\d+)?\s+/).splice(1)[0];
        let attrs = [];
        let cardClass = '';
        if (utils.hasDelimiters('only', attrOptions)(opts, attrOptions)) {
            attrs = utils.getAttrs(opts, 0, attrOptions);
            cardClass = utils.findAttrs(attrs, 'class');
        }
        // tokens
        const tokens = state.tokens;
        let hrIdx = 0;
        for (let i = start + 1; i < tokens.length - 1; i++) {
            // 第一步，查找hr
            let token = tokens[i];
            if (token.type === 'hr') {
                hrIdx = i;
                break;
            }
        }

        // 第二步：拆分
        let part1 = tokens.slice(start + 1, hrIdx);
        let part2 = tokens.slice(hrIdx + 1, tokens.length - 1);
        // console.log(part1, part2);
        // 第三步：查找哪part有img
        let imgs = hasImg(part1);
        if (imgs) {
            // 第一部分有图片
            tokens.splice(start + 1, 3, ...imgs);
            if (cardClass.indexOf('quote') === -1) {
                let level = tokens[start].level;
                const divToken = getOpenToken('div', level - 1);
                divToken.attrPush(['class', 'flex-content']);
                tokens.splice(hrIdx, 1, divToken);
                tokens.splice(tokens.length - 1, 0, getCloseToken('div', level - 1));
            } else {
                tokens.splice(hrIdx, 1);
            }

            // console.log(tokens);
        } else {
            imgs = hasImg(part2);
            if (imgs) {
                // 第二部分有图片
                if (cardClass.indexOf('quote') === -1) {
                    let level = tokens[start].level;
                    const divToken = getOpenToken('div', level - 1);
                    divToken.attrPush(['class', 'flex-content']);
                    tokens.splice(start + 1, 0, divToken);
                    tokens.splice(hrIdx + 1, 4, getCloseToken('div', level - 1), ...imgs);
                } else {
                    tokens.splice(hrIdx, 3, ...imgs);
                }
            }
        }
        // console.log(tokens.slice(start - 1));
    },
    render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
            let info = token.info.split(' ').shift();

            const cmIndex = token.attrIndex('css-module');
            let clsIndex = token.attrIndex('class');
            let attrs = token.attrs || [];
            if (info === 'card') {
                info = 'card-50';
            }
            if (clsIndex >= 0) {
                attrs[clsIndex][1] += cmIndex >= 0 ? ` ${info} ${attrs[cmIndex][1]}` : ` ${info}`;
            } else {
                attrs.push(['class', cmIndex >= 0 ? ` ${info} ${attrs[cmIndex][1]}` : ` ${info}`]);
            }

            attrs = attrs.map(([key, value]) => {
                if (key === 'class') {
                    // 处理掉 quote 存在 bg-wihte情况，和多个 bg-*情况

                    if (!~value.indexOf('bg') && value.indexOf('quote') === -1) {
                        value += ' bg-white';
                    }
                }
                return `${key}="${value}"`;
            });
            // opening tag
            return `<div ${attrs.join(' ')}>\n`;
        } else {
            // closing tag
            return '</div>\n';
        }
    }
};
