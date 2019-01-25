/**
 * @file 用于计算判断条件
 */

const chalk = require('chalk');

exports.evaluate = (exp, data) => {
    /* eslint-disable no-new-func */
    const fn = new Function('data', 'with (data) { return ' + exp + '}');
    try {
        return fn(data);
    } catch (e) {
        console.error(chalk.red('Error when evaluating filter condition: ' + exp));
    }
};
