/**
 * @file css webpack
 */

const {findExisting} = require('nodeppt-shared-utils');
const getAssetPath = require('../lib/utils').getAssetPath;
module.exports = (api, options) => {
    api.chainWebpack(webpackConfig => {
        const isProd = process.env.NODE_ENV === 'production';

        const {modules = false, extract = isProd, sourceMap = false, loaderOptions = {}} = options.css || {};

        const shouldExtract = extract !== false;

        const filename = getAssetPath(options, `css/[name]${options.filenameHashing ? '.[hash:8]' : ''}.css`);
        const extractOptions = Object.assign(
            {
                filename,
                chunkFilename: filename
            },
            extract && typeof extract === 'object' ? extract : {}
        );

        const cssPublicPath = '../'.repeat(
            extractOptions.filename.replace(/^\.[\/\\]/, '').split(/[\/\\]/g).length - 1
        );

        // if building for production but not extracting CSS, we need to minimize
        // the embbeded inline CSS as they will not be going through the optimizing
        // plugin.
        const needInlineMinification = isProd && !shouldExtract;

        function createCSSRule(lang, test, loader, options) {
            const baseRule = webpackConfig.module.rule(lang).test(test);
            // baseRule.exclude.add(/nodeppt/)
            applyLoaders(baseRule, modules);

            function applyLoaders(rule, modules) {
                if (shouldExtract) {
                    rule.use('extract-css-loader')
                        .loader(require('mini-css-extract-plugin').loader)
                        .options({
                            publicPath: cssPublicPath
                        });
                } else {
                    rule.use('style-loader').loader(require.resolve('style-loader'));
                }

                const cssLoaderOptions = Object.assign(
                    {
                        sourceMap,
                        importLoaders: 1 + (needInlineMinification ? 1 : 0) // stylePostLoader injected by vue-loader
                    },
                    loaderOptions.css
                );

                if (modules) {
                    const {localIdentName = '[name]_[local]_[hash:base64:5]'} = loaderOptions.css || {};
                    Object.assign(cssLoaderOptions, {
                        modules,
                        localIdentName
                    });
                }

                rule.use('css-loader')
                    .loader(require.resolve('css-loader'))
                    .options(cssLoaderOptions);

                if (loader) {
                    rule.use(loader)
                        .loader(require.resolve(loader))
                        .options(Object.assign({sourceMap}, options));
                }
            }
        }
        createCSSRule('css', /\.css$/);
        createCSSRule('sass', /\.scss$/, 'sass-loader', loaderOptions.sass);

        // inject CSS extraction plugin
        if (shouldExtract) {
            webpackConfig.plugin('extract-css').use(require('mini-css-extract-plugin'), [extractOptions]);
        }
    });
};
