module.exports = tree => {
    let slide;
    tree.match({tag: 'section'}, node => {
        if (node.attrs && node.attrs.slide) {
            slide = node;
        }
        return node;
    });
    let wrap;
    tree.match({tag: 'div'}, node => {
        if (node.attrs && node.attrs.wrap) {
            wrap = node;
        }
        return node;
    });

    return {
        slideNode: slide,
        wrapNode: wrap
    };
};
