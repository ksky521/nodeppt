const {getAttrs, getAttrsString} = require('../attrs/utils');

module.exports = {
    validate(params) {
        return true;
    },
    handler(state, opts) {
        return state;
    },
    render(tokens, idx) {
        const token = tokens[idx];

        if (token.nesting === 1) {
            let attrs = token.attrs || [];
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
