const {mergeAttrs} = require('../utils');

module.exports = tree => {
    let cardNode;
    tree.match({tag: 'card'}, node => {
        node.tag = 'div';
        const attrs = node.attrs || {size: 50};

        node.attrs = mergeAttrs({class: `bg-white card-${attrs.size ? attrs.size : 50}`}, node.attrs);

        let content = node.content;

        content = content.filter(c => c.tag && c.tag !== 'hr');
        const img = content.shift();
        img.tag = 'figure';
        node.content = [img, {tag: 'div', attrs: {class: 'flex-content'}, content}];

        cardNode = node;
        return node;
    });
    if (cardNode) {
        let isfs = false;
        tree.match({tag: 'section'}, node => {
            if (node.attrs && node.attrs.slide && node.attrs.class && node.attrs.class.includes('fullscreen')) {
                isfs = true;
            }
            return node;
        });
        if (isfs) {
            tree.match({tag: 'div'}, node => {
                if (node.attrs && node.attrs.wrap) {
                    return cardNode;
                }
                return node;
            });
        }
    }
};
