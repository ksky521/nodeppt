const {mergeAttrs} = require('../utils');

module.exports = tree => {
    tree.match({tag: 'h1'}, node => {
        node.attrs = mergeAttrs({class: 'text-landing'}, node.attrs);
        return node;
    });
};
