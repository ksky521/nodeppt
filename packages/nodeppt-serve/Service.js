/**
 * @file 简版Service
 */
const path = require('path');
const fs = require('fs');
const Config = require('webpack-chain');
const merge = require('webpack-merge');
const PluginAPI = require('./PluginAPI');
const {error, isPlugin, chalk, warn, getDebugLogger} = require('nodeppt-shared-utils');
const defaultsDeep = require('lodash.defaultsdeep');
const defaults = require('./options');
const debug = getDebugLogger('Service', require('./package.json').name);
const configFileName = 'nodeppt.config.js';

module.exports = class Service {
    constructor(context, entry, {plugins, pkg, useBuiltIn, inlineOptions} = {}) {
        this.initialized = false;
        this.entry = path.resolve(context, entry);
        this.inlineOptions = inlineOptions;
        this.pkg = pkg || {};
        this.pkgContext = context;
        this.commands = {};
        this.context = context;

        this.webpackChainFns = [];
        this.webpackRawConfigFns = [];
        this.devServerConfigFns = [];
        this.plugins = this.resolvePlugins(plugins, useBuiltIn);
        this.modes = this.plugins.reduce((modes, {apply: {defaultModes}}) => {
            return Object.assign(modes, defaultModes);
        }, {});
    }
    init(mode) {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.mode = mode;
        const userOptions = this.loadUserOptions();
        const projectOptions = (this.projectOptions = defaultsDeep(userOptions, defaults()));
        debug(projectOptions);
        // apply plugins.
        this.plugins.forEach(({id, apply}) => {
            apply(new PluginAPI(id, this), projectOptions);
        });
        if (projectOptions.chainWebpack) {
            this.webpackChainFns.push(projectOptions.chainWebpack);
        }
        if (projectOptions.configureWebpack) {
            this.webpackRawConfigFns.push(projectOptions.configureWebpack);
        }
    }
    loadUserOptions() {
        // hulk.config.js
        let fileConfig;
        let resolved;
        const configPath = path.resolve(this.context, configFileName);
        if (fs.existsSync(configPath)) {
            try {
                fileConfig = require(configPath);
                if (!fileConfig || typeof fileConfig !== 'object') {
                    error(`Error loading ${chalk.bold(configFileName)}: should export an object.`);
                    fileConfig = null;
                }
            } catch (e) {
                error(`Error loading ${chalk.bold(configFileName)}:`);
                throw e;
            }
        }

        if (fileConfig) {
            resolved = fileConfig;
        } else {
            resolved = this.inlineOptions || {};
        }

        // normalize some options
        ensureSlash(resolved, 'baseUrl');
        if (typeof resolved.baseUrl === 'string') {
            resolved.baseUrl = resolved.baseUrl.replace(/^\.\//, '');
        }
        removeSlash(resolved, 'outputDir');

        return resolved;
    }
    async run(name, args = {}, rawArgv = []) {
        // debugger;
        const mode = args.mode || (name === 'build' && args.watch ? 'development' : this.modes[name]);
        // load env variables, load user config, apply plugins
        this.init(mode);

        args._ = args._ || [];
        let command = this.commands[name];
        if (!command && name) {
            error(`command "${name}" does not exist.`);
            process.exit(1);
        }
        if (!command || args.help) {
            command = this.commands.help;
        } else {
            args._.shift(); // remove command itself
            rawArgv.shift();
        }
        const {fn} = command;
        return fn(args, rawArgv);
    }
    resolvePlugins(inlinePlugins, useBuiltIn) {
        const idToPlugin = id => ({
            id: id.replace(/^.\//, 'built-in:'),
            apply: require(id)
        });

        let plugins;

        const builtInPlugins = [
            './commands/serve',
            './commands/build',
            // config plugins are order sensitive
            './config/base',
            './config/css',
            './config/dev',
            './config/prod',
            './config/app'
        ].map(idToPlugin);

        if (inlinePlugins) {
            plugins = useBuiltIn !== false ? builtInPlugins.concat(inlinePlugins) : inlinePlugins;
        } else {
            const projectPlugins = Object.keys(this.pkg.devDependencies || {})
                .concat(Object.keys(this.pkg.dependencies || {}))
                .filter(isPlugin)
                .map(idToPlugin);
            plugins = builtInPlugins.concat(projectPlugins);
        }

        return plugins;
    }
    resolveChainableWebpackConfig() {
        const chainableConfig = new Config();
        // apply chains
        this.webpackChainFns.forEach(fn => fn(chainableConfig));
        return chainableConfig;
    }
    resolveWebpackConfig(chainableConfig = this.resolveChainableWebpackConfig()) {
        if (!this.initialized) {
            throw new Error('Service must call init() before calling resolveWebpackConfig().');
        }
        // get raw config
        let config = chainableConfig.toConfig();
        const original = config;
        // apply raw config fns
        this.webpackRawConfigFns.forEach(fn => {
            if (typeof fn === 'function') {
                // function with optional return value
                const res = fn(config);
                if (res) {
                    config = merge(config, res);
                }
            } else if (fn) {
                // merge literal values
                config = merge(config, fn);
            }
        });

        // #2206 If config is merged by merge-webpack, it discards the __ruleNames
        // information injected by webpack-chain. Restore the info so that
        // vue inspect works properly.
        if (config !== original) {
            cloneRuleNames(config.module && config.module.rules, original.module && original.module.rules);
        }

        return config;
    }
};

function cloneRuleNames(to, from) {
    if (!to || !from) {
        return;
    }
    from.forEach((r, i) => {
        if (to[i]) {
            Object.defineProperty(to[i], '__ruleNames', {
                value: r.__ruleNames
            });
            cloneRuleNames(to[i].oneOf, r.oneOf);
        }
    });
}

function ensureSlash(config, key) {
    let val = config[key];
    if (typeof val === 'string') {
        if (!/^https?:/.test(val)) {
            val = val.replace(/^([^/.])/, '/$1');
        }
        config[key] = val.replace(/([^/])$/, '$1/');
    }
}

function removeSlash(config, key) {
    if (typeof config[key] === 'string') {
        config[key] = config[key].replace(/\/$/g, '');
    }
}
