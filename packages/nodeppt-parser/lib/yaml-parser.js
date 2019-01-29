const yaml = require('js-yaml');
function getSettings(str) {
    const settings = yaml.load(str);
    const pluginSettings = {};
    if (settings.plugins && Array.isArray(settings.plugins)) {
        settings.plugins = settings.plugins.map(p => {
            if (typeof p === 'string') {
                return p;
            } else if (typeof p === 'object') {
                const key = Object.keys(p)[0];
                pluginSettings[key] = p[key];
                return key;
            }
        });
    }
    settings.pluginsOptions = pluginSettings;
    return settings;
}

module.exports = getSettings;
