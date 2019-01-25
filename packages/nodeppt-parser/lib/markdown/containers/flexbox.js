module.exports = (name, clss) => {
    if (!clss) {
        // 默认是 name
        clss = name;
    }
    return {
        validate(params) {
            return params.trim().match(new RegExp('^' + name + '\\s*(.*)$'));
        },
        handler(state, opts) {
            function getOpenToken(level) {
                const token = new state.Token('container_' + name + '_item_open', 'li', 1);
                token.block = true;
                token.level = 1 + level;
                return token;
            }
            function getCloseToken(level) {
                const token = new state.Token('container_' + name + '_item_close', 'li', -1);
                token.block = true;
                token.level = 1 + level;
                return token;
            }
            // tokens
            const tokens = state.tokens;
            let open = false;
            let done = 0;
            let firstChildIsP = false;
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (token.type === 'container_' + name + '_open') {
                    if (tokens[i + 1].type === 'paragraph_open') {
                        // 替换
                        tokens.splice(i + 1, 1, getOpenToken(token.level));
                        firstChildIsP = true;
                    } else {
                        // 在 open 后面插入
                        tokens.splice(i + 1, 0, getOpenToken(token.level));
                        i++;
                    }

                    open = true;
                } else if (token.type === 'container_' + name + '_close') {
                    if (firstChildIsP && tokens[i - 1].type === 'paragraph_close') {
                        // 替换
                        tokens.splice(i - 1, 1, getCloseToken(token.level));
                    } else {
                        // 在 close 之前插入
                        tokens.splice(i, 0, getCloseToken(token.level));
                        i++;
                    }
                    open = false;
                    firstChildIsP = false;
                } else if (open && 'hr' === token.type && done === 0) {
                    if (firstChildIsP && tokens[i - 1].type === 'paragraph_close') {
                        // 替换
                        tokens.splice(i - 1, 1);
                        // 修正 i
                        i--;
                        // 已经移出一个了
                        if (tokens[i + 1].type === 'paragraph_open') {
                            firstChildIsP = true;
                            // 替换
                            tokens.splice(i, 2, getCloseToken(token.level - 1), getOpenToken(token.level - 1));
                        } else {
                            firstChildIsP = false;

                            // 第一层的 Hr 需要替换
                            tokens.splice(i, 1, getCloseToken(token.level - 1), getOpenToken(token.level - 1));
                            i++;
                        }
                    } else {
                        if (tokens[i + 1].type === 'paragraph_open') {
                            firstChildIsP = true;
                            // 替换
                            tokens.splice(i, 2, getCloseToken(token.level - 1), getOpenToken(token.level - 1));
                        } else {
                            // 第一层的 Hr 需要替换
                            tokens.splice(i, 1, getCloseToken(token.level - 1), getOpenToken(token.level - 1));
                            i++;
                            firstChildIsP = false;
                        }
                    }
                } else if (open) {
                    // 加深一层，因为外面多套了一层div
                    token.level = token.level + 1;
                    // 保证hr 是最贴近 container 的一层
                    if (/_open$/.test(token.type)) {
                        done++;
                    } else if (/_close$/.test(token.type)) {
                        done--;
                    }
                }
            }
            return state;
        },
        render(tokens, idx) {
            const token = tokens[idx];

            if (token.nesting === 1) {
                const cmIndex = token.attrIndex('css-module');
                let clsIndex = token.attrIndex('class');
                let attrs = token.attrs || [];

                if (clsIndex >= 0) {
                    attrs[clsIndex][1] +=
                        cmIndex >= 0 ? ` flexblock ${clss} ${attrs[cmIndex][1]}` : ` flexblock ${clss}`;
                } else {
                    attrs.push([
                        'class',
                        cmIndex >= 0 ? `flexblock ${clss} ${attrs[cmIndex][1]}` : `flexblock ${clss}`
                    ]);
                }

                attrs = attrs.map(([key, value]) => {
                    return `${key}="${value}"`;
                });
                // opening tag
                return `<ul ${attrs.join(' ')}>\n`;
            } else {
                // closing tag
                return '</ul>\n';
            }
        }
    };
};
