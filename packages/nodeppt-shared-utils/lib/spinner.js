/**
 * @file loading 转圈效果
 */
const ora = require('ora');
const chalk = require('chalk');

const spinner = ora();
let lastMsg = null;

function getDefaultSymbol() {
    return process.platform === 'win32' ? '√' : '✔';
}
exports.logWithSpinner = (symbol, msg) => {
    if (!msg) {
        msg = symbol;
        symbol = chalk.green(getDefaultSymbol());
    }

    if (lastMsg) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        });
    }

    spinner.text = ' ' + msg;
    lastMsg = {
        symbol: symbol + ' ',
        text: msg
    };
    spinner.start();
};
exports.updateSpinner = (symbol, msg) => {
    if (!msg) {
        msg = symbol;
        symbol = chalk.green(getDefaultSymbol());
    }

    spinner.text = ' ' + msg;
    lastMsg = {
        symbol: symbol + ' ',
        text: msg
    };
};

exports.stopSpinner = persist => {
    if (lastMsg && persist !== false) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        });
    } else {
        spinner.stop();
    }
    lastMsg = null;
};

exports.pauseSpinner = () => {
    spinner.stop();
};

exports.resumeSpinner = () => {
    spinner.start();
};
exports.failSpinner = msg => {
    spinner.fail(msg);
};
exports.successSpinner = msg => {
    spinner.succeed(msg);
};
