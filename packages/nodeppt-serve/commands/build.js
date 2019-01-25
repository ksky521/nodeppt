/**
 * @file build 主要内容
 */
const {info} = require('nodeppt-shared-utils');

module.exports = (api, options) => {
    api.registerCommand('build', {}, async function serve(args) {
        info('Build ...');

        const webpack = require('webpack');
        // resolve webpack config
        const webpackConfig = api.resolveWebpackConfig();
        webpackConfig.mode = 'production';
        // entry arg
        const entry = args._[0];
        if (entry) {
            webpackConfig.entry = {
                app: api.resolve(entry)
            };
        }
        return new Promise((resolve, reject) => {
            webpack(webpackConfig, err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
};

module.exports.defaultModes = {
    build: 'production'
};
