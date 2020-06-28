const path = require('path');
const fs = require('fs-extra');
const defaultDeep = require('lodash.defaultsdeep');
const ejs = require('ejs');
const loaderUtils = require('loader-utils');

const getParser = require('./lib/get-parser');
// parsers
const yamlParser = require('./lib/yaml-parser');

const defaults = require('./defaults');

// 模板
const defaultTemplate = fs.readFileSync(path.join(__dirname, './template/index.ejs')).toString();
// 这里不要用箭头函数，this 指向问题！
/* eslint-disable space-before-function-paren */
module.exports = function (content) {
    /* eslint-enable space-before-function-paren */
    const {plugins = []} = loaderUtils.getOptions(this);
    const resourcePath = this.resourcePath;
    const parser = getParser(plugins);

    const settings = content.split(/<slide.*>/i)[0];
    const yamlSettings = yamlParser(settings);
    // 支持baseTemplate，传入ejs模板
    let template = defaultTemplate;
    if (yamlSettings.baseTemplate && typeof yamlSettings.baseTemplate === 'string') {
        const baseTemplate = path.resolve(path.dirname(resourcePath), yamlSettings.baseTemplate);
        if (fs.existsSync(baseTemplate)) {
            template = fs.readFileSync(baseTemplate).toString();
        }
    }
    // 首部 yaml 设置部分
    const globalSettings = defaultDeep(yamlSettings, defaults);
    content = parser(content);

    return ejs.render(template, {...globalSettings, content});
};
