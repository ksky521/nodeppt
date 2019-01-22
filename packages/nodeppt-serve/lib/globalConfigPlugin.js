/**
 * @file global config plugin
 */
const path = require('path')
const {findExisting} = require('nodeppt-shared-utils')

module.exports = function createConfigPlugin(context, entry, asLib) {
  return {
    id: 'nodeppt-service-global-config',
    apply: (api, options) => {
      api.chainWebpack(config => {
        // entry arg
        const entry = require.resolve('../template/main.js')
        config.resolve.alias.set('~entry', path.resolve(context, entry))
        // set entry
        config
          .entry('app')
          .clear()
          .add(entry)

        // disable copy plugin if no public dir
        if (asLib || !findExisting(context, ['public'])) {
          config.plugins.delete('copy')
        }
      })
    }
  }
}
