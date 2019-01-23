/**
 * @file 工具函数导出
 */

['logger', 'spinner', 'get-debug', 'get-latest-version', 'webpack-error', 'prepare-urls', 'find-existing'].forEach(
    m => {
        Object.assign(exports, require(`./lib/${m}`));
    }
);

exports.chalk = require('chalk');
