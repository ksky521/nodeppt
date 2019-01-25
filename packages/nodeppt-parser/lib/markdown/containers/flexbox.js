module.exports = (name, clss) => {
    if (!clss) {
        // 默认是 name
        clss = name;
    }
    return {
        validate(params) {
            return params.trim().match(new RegExp('^' + name + '\\s*(.*)$'));
        },
        handler(state, opts, start, end) {
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
            // console.log(5555,opts, tokens)
            for (let i = start; i < tokens.length; i++) {
                const token = tokens[i];
                if (token.type === 'container_' + name + '_open') {
                    // 在 open 后面插入
                    tokens.splice(i + 1, 0, getOpenToken(token.level));
                    i++;
                    // console.log(666666);
                    open = true;
                    continue;
                } else if (token.type === 'container_' + name + '_close') {
                    // 在 close 之前插入
                    tokens.splice(i, 0, getCloseToken(token.level));
                    i++;
                    open = false;
                    continue;
                } else if (open && 'hr' === token.type && done === 0) {
                    // 第一层的 Hr 需要替换
                    // console.log(77777);
                    tokens.splice(i, 1, getCloseToken(token.level - 1), getOpenToken(token.level - 1));
                    i++;
                } else if (open) {
                    if (token.type === 'paragraph_close' || token.type === 'paragraph_open') {
                        tokens.splice(i, 1);
                        i--;
                        continue;
                    }
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
            // console.log(tokens);
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
