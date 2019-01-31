const mditr = require('./regexp');

const {getAttrs, getAttrsString} = require('./attrs/utils');

module.exports = md => {
    md.use(
        mditr(
            /!!\[(\w+|)(.*?)?]\((.+?)\)/,
            (match, utils) => {
                let attrs = match[2] || '';
                if (attrs) {
                    attrs = getAttrsString(
                        getAttrs(`{${attrs}}`, 0, {
                            leftDelimiter: '{',
                            rightDelimiter: '}'
                        })
                    );
                }
                let src = match[3];
                let srcs = src.split(' ');
                src = srcs.shift();
                let imgAttrs = '';
                if (srcs.length) {
                    imgAttrs = getAttrsString(
                        getAttrs(`{${srcs.join(' ')}}`, 0, {
                            leftDelimiter: '{',
                            rightDelimiter: '}'
                        })
                    );
                }
                if (match[1]) {
                    return `<${match[1]} ${attrs}><img src="${src}" ${imgAttrs}/></${match[1]}>`;
                } else {
                    return `<img src="${src}" ${imgAttrs}/>`;
                }
            },
            'img_block'
        )
    );

    md.core.ruler.push('img_blockify', function(state) {
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

                var prevBlkToken = state.tokens[i - 1];
                if (prevBlkToken.type !== 'inline') {
                    break;
                }
                // console.log(prevBlkToken.content)
                var prevInlineToken = prevBlkToken.children[prevBlkToken.children.length - 1];
                if (prevInlineToken.type !== 'img_block') {
                    break;
                }

                prevInlineToken.content += '\n';
                paragraphTokensToRemove.push(blkIdx, i);
                break;
            }
        }

        state.tokens = state.tokens.filter((blkToken, idx) => {
            return paragraphTokensToRemove.indexOf(idx) === -1;
        });
    });
};
