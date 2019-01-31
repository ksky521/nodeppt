const utils = require('./utils');

module.exports = tree => {
    let {slideNode, wrapNode} = utils(tree);

    if (wrapNode.content && wrapNode.content.length) {
        // console.log(wrapNode.content)

        wrapNode.content = wrapNode.content.map(n => {
            if (n.tag === 'note') {
                n.tag = 'div';
                let cls = '';
                if (n.attrs) {
                    cls = n.attrs.class || '';
                }
                n.attrs = n.attrs || {};
                cls = cls.split(/\s+/);
                cls.push('note');

                n.attrs.class = cls.join(' ');

                n.content = [
                    {
                        tag: 'div',
                        attrs: {
                            class: 'wrap'
                        },
                        content: n.content
                    }
                ];
                slideNode.content.push(n);
                return false;
            }
            return n;
        });
    }
};
