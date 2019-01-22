const yaml = require('js-yaml')
function getSettings(str) {
  return yaml.load(str)
}

module.exports = getSettings
