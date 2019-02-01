/**
 * @file base
 */
const path = require('path');
const webpack = require('webpack');
const {transformer, formatter} = require('nodeppt-shared-utils');
module.exports = (api, options) => {
    api.chainWebpack(webpackConfig => {
        const {getAssetPath, resolveLocal} = require('../lib/utils');
        const inlineLimit = 4096;

        const genAssetSubPath = dir => {
            return getAssetPath(options, `${dir}/[name]${options.filenameHashing ? '.[hash:8]' : ''}.[ext]`);
        };

        const genUrlLoaderOptions = dir => {
            return {
                limit: inlineLimit,
                // use explicit fallback to avoid regression in url-loader>=1.1.0
                fallback: {
                    loader: 'file-loader',
                    options: {
                        name: genAssetSubPath(dir)
                    }
                }
            };
        };
        let entryName = 'app';
        if (api.service.entry) {
            entryName = api.getEntryName();
        }
        webpackConfig
            .mode('development')
            .context(api.context)
            .entry(entryName)
            .add('./main.js')
            .end()
            .output.path(api.resolve(options.outputDir))
            .filename(`[name]${options.filenameHashing ? '.[hash:8]' : ''}.js`)
            .publicPath(options.baseUrl);

        webpackConfig.resolve
            .set('symlinks', false)
            .extensions.merge(['.js', '.less'])
            .end()
            .modules.add('node_modules')
            .add(api.resolve('node_modules'))
            .add(resolveLocal('node_modules'))
            .end();

        webpackConfig.resolveLoader.modules
            .add('node_modules')
            .add(api.resolve('node_modules'))
            .add(resolveLocal('node_modules'));

        webpackConfig.module
            .rule('markdown')
            .test(/\.(md|markdown)$/)
            .use('html-loader')
            .loader(require.resolve('html-loader'))
            .end()
            .use('nodeppt-parser')
            .loader(require.resolve('nodeppt-parser'))
            .options({plugins: options.plugins})
            .end();

        webpackConfig.module
            .rule('js')
            .test(/\.js$/)
            .use('babel-loader')
            .loader(require.resolve('babel-loader'))
            .options({cacheDirectory: true})
            .end();
        // static assets -----------------------------------------------------------

        webpackConfig.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
            .use('url-loader')
            .loader(require.resolve('url-loader'))
            .options(genUrlLoaderOptions('img'));

        // do not base64-inline SVGs.
        // https://github.com/facebookincubator/create-react-app/pull/1180
        webpackConfig.module
            .rule('svg')
            .test(/\.(svg)(\?.*)?$/)
            .use('file-loader')
            .loader(require.resolve('file-loader'))
            .options({
                name: genAssetSubPath('img')
            });

        webpackConfig.module
            .rule('media')
            .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
            .use('url-loader')
            .loader(require.resolve('url-loader'))
            .options(genUrlLoaderOptions('media'));

        webpackConfig.module
            .rule('fonts')
            .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
            .use('url-loader')
            .loader(require.resolve('url-loader'))
            .options(genUrlLoaderOptions('fonts'));

        webpackConfig.plugin('banner').use(
            new webpack.BannerPlugin({
                banner: 'created by nodeppt 2.0'
            })
        );

        webpackConfig.plugin('case-sensitive-paths').use(require('case-sensitive-paths-webpack-plugin'));

        // friendly error plugin displays very confusing errors when webpack
        // fails to resolve a loader, so we provide custom handlers to improve it
        webpackConfig.plugin('friendly-errors').use(require('friendly-errors-webpack-plugin'), [
            {
                additionalTransformers: [transformer],
                additionalFormatters: [formatter]
            }
        ]);
    });
};
