/**
 * @file global config plugin
 */
const path = require('path');
const {findExisting} = require('nodeppt-shared-utils');

module.exports = function createConfigPlugin(context, entry, asLib) {
    return {
        id: 'nodeppt-service-global-config',
        apply: (api, options) => {
            api.chainWebpack(config => {
                // entry arg
                const entry = require.resolve('../template/main.js');
                config.resolve.alias.set('~entry', path.resolve(context, entry));

                let entryName = 'app';
                if (api.service.entry) {
                    entryName = api.getEntryName();
                }
                // set entry
                config
                    .entry(entryName)
                    .clear()
                    .add(entry);

                // disable copy plugin if no public dir
                if (asLib || !findExisting(context, ['public'])) {
                    config.plugins.delete('copy');
                }
            });
        }
    };
};
