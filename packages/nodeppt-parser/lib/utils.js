exports.mergeAttrs = (attrs1, attrs2 = {}) => {
    for (let i in attrs2) {
        switch (i) {
            case 'class':
                attrs1[i] = attrs1[i] ? [attrs1[i], attrs2[i]].join(' ') : attrs2[i];
                break;
            case 'style':
                attrs1[i] = attrs1[i] ? [attrs1[i], attrs2[i]].join(';') : attrs2[i];
                break;
            default:
                attrs1[i] = attrs2[i];
        }
    }
    return attrs1;
};
