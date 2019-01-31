const Utils = require('./attrs/utils');

const hasDelimiters = Utils.hasDelimiters('only', Utils.getOptions());

// 修改 https://github.com/pnewell/markdown-it-span/blob/master/index.js
module.exports = function ins_plugin(md) {
    // Insert each marker as a separate text token, and add it to delimiter list
    //
    function tokenize(state, silent) {
        var i,
            scanned,
            token,
            len,
            ch,
            start = state.pos,
            marker = state.src.charCodeAt(start);

        if (silent) {
            return false;
        }

        if (marker !== 0x3a /* : */) {
            return false;
        }
        // 排查 :fa-:

        if (state.src.charCodeAt(start + 1) === 0x66 /* f */ && state.src.charCodeAt(start + 2) === 0x61 /* a */) {
            return false;
        }
        // 排查 ::fa-::
        // 排查 :~fa-

        if (
            state.src.charCodeAt(start + 2) === 0x66 /* f */ &&
            state.src.charCodeAt(start + 3) === 0x61 /* a */ &&
            (state.src.charCodeAt(start + 1) === 0x3a /* : */ || state.src.charCodeAt(start + 1) === 0x7e) /* ~ */
        ) {
            return false;
        }

        scanned = state.scanDelims(state.pos, true);
        len = scanned.length;
        ch = String.fromCharCode(marker);

        if (len < 1) {
            return false;
        }

        if (len % 1) {
            token = state.push('text', '', 0);
            token.content = ch;
            len--;
        }

        for (i = 0; i < len; i += 1) {
            token = state.push('text', '', 0);
            token.content = ch + ch;

            state.delimiters.push({
                marker: marker,
                jump: i,
                token: state.tokens.length - 1,
                level: state.level,
                end: -1,
                open: scanned.can_open,
                close: scanned.can_close
            });
        }

        state.pos += scanned.length;

        return true;
    }

    // Walk through delimiter list and replace text tokens with tags
    //
    function postProcess(state) {
        var i,
            j,
            startDelim,
            endDelim,
            token,
            loneMarkers = [],
            delimiters = state.delimiters,
            max = state.delimiters.length;

        for (i = 0; i < max; i++) {
            startDelim = delimiters[i];

            if (startDelim.marker !== 0x3a /* : */) {
                continue;
            }

            if (startDelim.end === -1) {
                continue;
            }

            endDelim = delimiters[startDelim.end];
            token = state.tokens[startDelim.token];
            token.type = 'span_open';
            token.tag = 'span';
            token.nesting = 1;
            token.markup = ':';
            token.content = '';
            let jsx = state.tokens[endDelim.token + 1];
            if (jsx && jsx.type === 'jsx_inline' && hasDelimiters(jsx.content)) {
                // 说明是{.xxx}样式
                let attrs = Utils.getAttrs(jsx.content, 0, Utils.getOptions());
                Utils.addAttrs(attrs, token);
                // 清理干净
                jsx.type = 'text';
                jsx.content = '';
            }

            token = state.tokens[endDelim.token];
            token.type = 'span_close';
            token.tag = 'span';
            token.nesting = -1;
            token.markup = ':';
            token.content = '';

            if (state.tokens[endDelim.token - 1].type === 'text' && state.tokens[endDelim.token - 1].content === ':') {
                loneMarkers.push(endDelim.token - 1);
            }
        }

        // If a marker sequence has an odd number of characters, it's splitted
        // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
        // start of the sequence.
        //
        // So, we have to move all those markers after subsequent s_close tags.
        //
        while (loneMarkers.length) {
            i = loneMarkers.pop();
            j = i + 1;

            while (j < state.tokens.length && state.tokens[j].type === 'span_close') {
                j++;
            }

            j--;

            if (i !== j) {
                token = state.tokens[j];
                state.tokens[j] = state.tokens[i];
                state.tokens[i] = token;
            }
        }
    }

    md.inline.ruler.before('emphasis', 'span', tokenize);
    md.inline.ruler2.before('emphasis', 'span', postProcess);
};
