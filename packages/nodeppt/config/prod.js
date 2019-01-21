/**
 * @file prod webpack
 */
module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
    if (process.env.NODE_ENV === 'production') {
      const getAssetPath = require('../lib/utils').getAssetPath
      const filename = getAssetPath(options, `js/[name]${options.filenameHashing ? '.[hash:8]' : ''}.js`)

      webpackConfig
        .mode('production')
        .devtool(options.productionSourceMap ? 'source-map' : false)
        .output.filename(filename)
        .chunkFilename(filename)

      // keep module.id stable when vendor modules does not change
      webpackConfig.plugin('hash-module-ids').use(require('webpack/lib/HashedModuleIdsPlugin'), [
        {
          hashDigest: 'hex'
        }
      ])
    }
  })
}
