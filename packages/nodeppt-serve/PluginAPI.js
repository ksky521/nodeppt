/**
 * @file pluginAPI from vue cli
 */
const path = require('path');

class PluginAPI {
    constructor(id, service) {
        this.id = id;
        this.service = service;
    }
    getEntry() {
        return this.service.entry;
    }
    getEntryName() {
        return path.parse(this.service.entry).name;
    }
    /**
     * 获取当前工作目录
     * @return {string} 返回工作目录
     */
    getCwd() {
        return this.service.context;
    }
    /**
     * 获取配置，不传入则返回全部
     * @param {string} name
     */
    getProjectOptions(name) {
        const opts = this.service.projectOptions;
        if (name) {
            return opts[name];
        }
        return opts;
    }
    /**
     * Resolve path for a project.
     *
     * @param {string} p - Relative path from project root
     * @return {string} The resolved absolute path.
     */
    resolve(p) {
        return path.resolve(this.service.context, p);
    }

    registerCommand(name, opts, fn) {
        if (typeof opts === 'function') {
            fn = opts;
            opts = null;
        }
        this.service.commands[name] = {fn, opts: opts || {}};
    }

    chainWebpack(fn) {
        this.service.webpackChainFns.push(fn);
    }

    configureWebpack(fn) {
        this.service.webpackRawConfigFns.push(fn);
    }

    configureDevServer(fn) {
        this.service.devServerConfigFns.push(fn);
    }

    resolveWebpackConfig(chainableConfig) {
        return this.service.resolveWebpackConfig(chainableConfig);
    }

    /**
     * Resolve an intermediate chainable webpack config instance, which can be
     * further tweaked before generating the final raw webpack config.
     * You can call this multiple times to generate different branches of the
     * base webpack config.
     * See https://github.com/mozilla-neutrino/webpack-chain
     *
     * @return {ChainableWebpackConfig}
     */
    resolveChainableWebpackConfig() {
        return this.service.resolveChainableWebpackConfig();
    }
}

module.exports = PluginAPI;
