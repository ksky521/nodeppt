const name = 'steps';

module.exports = {
    validate(params) {
        return params.trim().match(new RegExp('^' + name + '\\s*(.*)$'));
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
        // tokens
        const tokens = state.tokens;

        let open = false;
        let done = 0;
        let step = 1;
        for (let i = start; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type === 'container_' + name + '_open') {
                // 在 open 后面插入
                tokens.splice(i + 1, 0, getOpenToken('li', token.level));
                open = true;
                i++;
            } else if (token.type === 'container_' + name + '_close') {
                // 在 close 之前插入
                tokens.splice(i, 0, getCloseToken('li', token.level));
                open = false;
                i++;
            } else if (open && 'hr' === token.type && done === 0) {
                // 第一层的 Hr 需要替换
                tokens.splice(i, 1, getCloseToken('li', token.level - 1), getOpenToken('li', token.level - 1));
                i++;

                step++;
                if (step >= 2) {
                    let t1 = getOpenToken('div', token.level);
                    t1.attrPush(['class', `process step-${step}`]);
                    tokens.splice(i + 1, 0, t1, getCloseToken('div', token.level));
                    i = i + 2;
                }
            } else if (open) {
                // 加深一层，因为外面多套了一层div
                token.level = token.level + 2;
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
                attrs[clsIndex][1] += cmIndex >= 0 ? ` flexblock steps ${attrs[cmIndex][1]}` : ` flexblock steps`;
            } else {
                attrs.push(['class', cmIndex >= 0 ? `flexblock steps ${attrs[cmIndex][1]}` : `flexblock steps`]);
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
