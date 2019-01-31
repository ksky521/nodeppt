const mditr = require('./regexp');

module.exports = md => {
    // FA4 style.
    md.use(
        mditr(
            /\:fa-(.+?)\:/,
            (match, utils) => {
                return '<i class="fa fa-' + utils.escape(match[1]) + '"></i>';
            },
            'fa_inline'
        )
    );

    md.use(
        mditr(
            /\:\~fa-(.+?)~\:/,
            (match, utils) => {
                return '<span><i class="fa fa-' + utils.escape(match[1]) + '"></i></span>';
            },
            'fa_span'
        )
    );

    md.use(
        mditr(
            /\:\:fa-(.+?)\:\:/,
            (match, utils) => {
                return '<i class="fa fa-' + utils.escape(match[1]) + '"></i>';
            },
            'fa_block'
        )
    );

    md.core.ruler.push('fa_blockify', function(state) {
        var paragraphTokensToRemove = [];

        var lastInlineTokenSeen;
        for (var blkIdx = 0; blkIdx < state.tokens.length; blkIdx++) {
            if (state.tokens[blkIdx].type !== 'paragraph_open') {
                continue;
            }

            var nextBlkToken = state.tokens[blkIdx + 1];
            if (nextBlkToken.type !== 'inline') {
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

                if (prevInlineToken.type !== 'fa_block' && prevInlineToken.type !== 'fa_span') {
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
};
