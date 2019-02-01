/**
 * @file prod webpack
 */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = (api, options) => {
    api.chainWebpack(webpackConfig => {
        if (process.env.NODE_ENV === 'production') {
            const getAssetPath = require('../lib/utils').getAssetPath;
            const filename = getAssetPath(options, `js/[name]${options.filenameHashing ? '.[hash:8]' : ''}.js`);

            webpackConfig
                .mode('production')
                .devtool(options.productionSourceMap ? 'source-map' : false)
                .output.filename(filename)
                .chunkFilename(filename);
            // 压缩
            webpackConfig.optimization
                .minimizer('css')
                .use(OptimizeCSSAssetsPlugin, [{cssProcessorOptions: {safe: true}}]);

            webpackConfig.optimization.minimizer('js').use(new TerserPlugin());

            // keep module.id stable when vendor modules does not change
            webpackConfig.plugin('hash-module-ids').use(require('webpack/lib/HashedModuleIdsPlugin'), [
                {
                    hashDigest: 'hex'
                }
            ]);
        }
    });
};
