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
            let params = token.info.trim();
            params = getAttrsString(
                getAttrs(`{${params}}`, 0, {
                    leftDelimiter: '{',
                    rightDelimiter: '}'
                })
            );
            // opening tag
            return `<div ${params}>\n`;
        } else {
            // closing tag
            return '</div>\n';
        }
    }
};
