/**
 * @file get debug
 */
const {name} = require('../package.json');
const debug = require('debug');
exports.getDebugLogger = (ns, scope = name) => {
    const ms = [scope, ns].filter(v => v).join(':');
    return debug(ms);
};
