/**
 * Loops through block tokens to find bullet list opens using
 * the plus sign.
 *
 * @param {any} state
 * @param {string} className
 */
function findChecklists(state, className) {
    state.tokens.forEach(function(token) {
        if (token.type === 'bullet_list_open' && token.markup === '+') {
            applyClass(token, className);
        }
    });
}

/**
 * Adds class to token
 *
 * @param {any} token
 * @param {string} className
 */
function applyClass(token, className) {
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

module.exports = function plugin(md, className) {
    // Default class name
    className = className || 'checklist';
    md.block.ruler.after('list', 'list-checkmarks', function(state) {
        findChecklists(state, className);
    });
};
