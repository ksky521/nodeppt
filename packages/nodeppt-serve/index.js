/**
 * @file hulk -serve
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const globalConfigPlugin = require('./lib/globalConfigPlugin');
const {findExisting} = require('nodeppt-shared-utils');
const Service = require('./Service');

function resolveEntry(entry) {
    const context = process.cwd();

    entry = entry || findExisting(context, ['main.js', 'index.js']);

    if (!entry) {
        console.log(chalk.red(`Failed to locate entry file in ${chalk.yellow(context)}.`));
        console.log(chalk.red('Valid entry file should be one of: main.js, index.js.'));
        process.exit(1);
    }
    if (!fs.existsSync(path.resolve(context, entry))) {
        console.log(chalk.red(`Entry file ${chalk.yellow(entry)} does not exist.`));
        process.exit(1);
    }

    return {
        context,
        entry
    };
}
exports.serve = (e, args) => {
    const {context, entry} = resolveEntry(e);
    createService(context, entry, {version: args.version || '2.0'}).run('serve', args);
};
exports.build = (e, args) => {
    const {context, entry} = resolveEntry(e);
    const asLib = args.target && args.target !== 'app';
    if (asLib) {
        args.entry = entry;
    }
    createService(context, entry, {version: args.version || '2.0'}, asLib).run('build', args);
};

function createService(context, entry, nodepptOptions, asLib, plugins = []) {
    // console.log(plugins);
    return new Service(context, entry, {
        nodepptOptions,
        plugins: [...plugins, globalConfigPlugin(context, entry, asLib)]
    });
}
