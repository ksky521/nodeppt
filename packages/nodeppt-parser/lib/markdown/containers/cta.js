const name = 'cta';
module.exports = {
    validate(params) {
        return params.trim().match(new RegExp('^' + name + '\\s*(.*)$'));
    },
    handler(state, opts) {
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
        let count = 1;
        let level = 1;
        let imgStart = 0,
            imgEnd = 0;
        let ctxStart = 0,
            ctxEnd = 0;

        let img = [],
            context = [];
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            if (token.type === 'container_' + name + '_open') {
                // 在 open 后面插入
                open = true;
                level = token.level + 1;
            } else if (token.type === 'container_' + name + '_close') {
                // 在 close 之前插入
                open = false;
            } else if (open && 'hr' === token.type && done === 0) {
                tokens.splice(i, 1);
                i--;
                count++;
            } else if (open) {
                // 加深一层，因为外面多套了一层div
                // token.level = token.level + 2;
                // 保证hr 是最贴近 container 的一层
                if (/_open$/.test(token.type)) {
                    done++;
                } else if (/_close$/.test(token.type)) {
                    done--;
                }
                if (count === 1) {
                    if (!imgStart) {
                        imgStart = i;
                    } else {
                        imgEnd = i;
                    }
                    img.push(token);
                } else {
                    if (!ctxStart) {
                        ctxStart = i;
                    } else {
                        ctxEnd = i;
                    }
                    token.level = token.level + 1;
                    context.push(token);
                }
            }
        }
        // 分组完成
        const divNumber = getOpenToken('div', level - 1);
        divNumber.attrPush(['class', 'number']);
        tokens.splice(imgStart, imgEnd - imgStart + 1, divNumber, ...img, getCloseToken('div', level - 1));

        const divToken = getOpenToken('div', level - 1);
        divToken.attrPush(['class', 'benefit']);
        tokens.splice(ctxStart + 2, ctxEnd - ctxStart + 3, divToken, ...context, getCloseToken('div', level - 1));
        return state;
    },
    render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
            const cmIndex = token.attrIndex('css-module');
            let clsIndex = token.attrIndex('class');
            let attrs = token.attrs || [];

            if (clsIndex >= 0) {
                attrs[clsIndex][1] += cmIndex >= 0 ? ` cta ${attrs[cmIndex][1]}` : ` cta`;
            } else {
                attrs.push(['class', cmIndex >= 0 ? ` cta ${attrs[cmIndex][1]}` : ` cta`]);
            }

            attrs = attrs.map(([key, value]) => {
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
