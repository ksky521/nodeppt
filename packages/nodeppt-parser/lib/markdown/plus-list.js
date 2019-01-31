function findChecklists(state) {
    console.log(state.tokens);
    state.tokens.forEach((token, i) => {
        if (token.type === 'bullet_list_open' && token.markup === '+') {
            // console.log(state.tokens[i + 1]);
            // applyClass(token);
        }
    });
}

/**
 * Adds class to token
 *
 * @param {any} token
 * @param {string} className
 */
function applyClass(token) {
    // init attributes
    token.attrs = token.attrs || [];

    // get index of class attribute
    let keys = token.attrs.map(arr => arr[0]);
    let idx = keys.indexOf('class');

    if (idx === -1) {
        // Add class attribute if not defined
        token.attrs.push(['class', className]);
    } else {
        // Get the current class list to append.
        // Watch out for duplicates
        let classStr = token.attrs[idx][1] || '';
        let classList = classStr.split(' ');

        // Add the class if we don't already have it
        if (classList.indexOf(className) === -1) {
            token.attrs[idx][1] = classStr += ' ' + className;
        }
    }
}

module.exports = function plugin(md) {
    // Default class name
    md.block.ruler.after('list', 'list-checkmarks', state => {
        findChecklists(state);
    });
};
