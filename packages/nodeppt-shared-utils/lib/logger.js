/**
 * @file logger 封装
 */

const chalk = require('chalk');
const readline = require('readline');
const padStart = require('string.prototype.padstart');
const EventEmitter = require('events');
const logger = console.log;
const error = console.error;
const warn = console.warn;
exports.events = new EventEmitter();

const format = (label, msg) => {
    return msg
        .split('\n')
        .map((line, i) => {
            return i === 0 ? `${label} ${line}` : padStart(line, chalk.reset(label).length);
        })
        .join('\n');
};

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `);

exports.log = (msg = '', tag = null) => {
    tag ? logger(format(chalkTag(tag), msg)) : logger(msg);
};

exports.info = (msg, tag = null) => {
    logger(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
};

exports.done = (msg, tag = null) => {
    logger(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
};

exports.warn = (msg, tag = null) => {
    warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
};

exports.error = (msg, tag = null) => {
    error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
    if (msg instanceof Error) {
        error(msg.stack);
    }
};
exports.line = msg => {
    logger();
    msg ? logger('─'.repeat(20) + msg + '─'.repeat(20)) : logger('─'.repeat(45));
    logger();
};
exports.success = (msg, tag) => {
    if (typeof tag !== 'string') {
        tag = process.platform === 'win32' ? '√' : '✔';
    }

    tag ? logger(format(`${chalk.green(tag)} `, msg)) : logger(msg);
};

exports.clearConsole = () => {
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        logger(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }
};
