/**
 * @file build 主要内容
 */
const {info} = require('nodeppt-shared-utils');
const path = require('path');
module.exports = (api, options) => {
    api.registerCommand('build', {}, async function serve(args) {
        info('Build ...');
        const context = process.cwd();
        const {dest} = args;

        process.env.NODE_ENV = 'production';
        const webpack = require('webpack');
        // resolve webpack config
        const webpackConfig = api.resolveWebpackConfig();
        webpackConfig.mode = 'production';

        if (!args.map) {
            delete webpackConfig.devtool; // = null;
        }
        webpackConfig.output.publicPath = './';

        if (dest) {
            const targetDir = path.resolve(context, dest || options.outputDir);
            webpackConfig.output.path = targetDir;
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
