'use strict';
// from https://github.com/osnr/markdown-it-jsx/
var jsx_inline = require('markdown-it-jsx/lib/jsx_inline');
var escape_code = require('markdown-it-jsx/lib/escape_code');

module.exports = function jsx_plugin(md) {
    md.set({xhtmlOut: true});

    // JSX should entirely replace embedded HTML.
    md.inline.ruler.before('html_inline', 'jsx_inline', jsx_inline);
    md.disable('html_inline');
    // We'll parse blocks as inline and then strip the surrounding paragraph at the end; it's easier.
    md.disable('html_block');

    md.core.ruler.push('jsx_blockify', function(state) {
        // Look for things like <p><Component> ... </Component></p> and strip the <p>, </p> there.
        // FIXME Quadratic time in worst case, I think?
        var paragraphTokensToRemove = [];

        var lastInlineTokenSeen;
        for (var blkIdx = 0; blkIdx < state.tokens.length; blkIdx++) {
            if (state.tokens[blkIdx].type !== 'paragraph_open') {
                continue;
            }

            var nextBlkToken = state.tokens[blkIdx + 1];
            if (nextBlkToken.type !== 'inline' || nextBlkToken.children[0].type !== 'jsx_inline') {
                continue;
            }

            // FIXME Incorrect and a hack:
            // <p><Component> ... </OtherComponent></p> will also get stripped.
            var paragraphOpens = 0;
            for (var i = blkIdx + 1; i < state.tokens.length; i++) {
                if (state.tokens[i].type === 'paragraph_open') {
                    paragraphOpens++;
                    continue;
                } else if (state.tokens[i].type !== 'paragraph_close') {
                    continue;
                }

                if (paragraphOpens > 0) {
                    paragraphOpens--;
                    continue;
                }

                // OK, this is the paragraph_close matching the open we started on.
                // What came right before here?
                var prevBlkToken = state.tokens[i - 1];
                if (prevBlkToken.type !== 'inline') {
                    break;
                }
                var prevInlineToken = prevBlkToken.children[prevBlkToken.children.length - 1];
                if (prevInlineToken.type !== 'jsx_inline') {
                    break;
                }

                // If we got this far, we're stripping the surrounding paragraph.

                // FIXME Also a hack. The 'inline' JSX that's inside the paragraph should
                // now get a linebreak after it in the generated HTML. Easier to test
                // and looks better in the HTML.
                prevInlineToken.content += '\n';
                paragraphTokensToRemove.push(blkIdx, i);
                break;
            }
        }

        state.tokens = state.tokens.filter(function(blkToken, idx) {
            return paragraphTokensToRemove.indexOf(idx) === -1;
        });
    });

    // 去掉代码注释
    // md.renderer.rules.fence = escape_code(md.renderer.rules.fence)
    // md.renderer.rules.code_inline = escape_code(md.renderer.rules.code_inline)
    // md.renderer.rules.code_block = escape_code(md.renderer.rules.code_block)

    md.renderer.rules['jsx_inline'] = function(tokens, idx) {
        // If the span is JSX, just pass the original source for the span
        // through to output.
        return tokens[idx].content;
    };
};
