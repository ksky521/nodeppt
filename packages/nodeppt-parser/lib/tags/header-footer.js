const utils = require('./utils');

module.exports = tree => {
    let {slideNode, wrapNode} = utils(tree);

    if (wrapNode.content && wrapNode.content.length) {
        // console.log(wrapNode.content)

        wrapNode.content = wrapNode.content.map(n => {
            if (n.tag === 'footer' || n.tag === 'header') {
                n.content = [
                    {
                        tag: 'div',
                        attrs: {
                            class: 'wrap'
                        },
                        content: n.content
                    }
                ];
                if (n.tag === 'header') {
                    slideNode.content.unshift(n);
                } else {
                    slideNode.content.push(n);
                }
                return false;
            }
            return n;
        });
    }
};
