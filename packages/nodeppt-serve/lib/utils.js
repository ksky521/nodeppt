const fs = require('fs');
const path = require('path');
const {findExisting, chalk} = require('nodeppt-shared-utils');

exports.resolveEntry = entry => {
    const context = process.cwd();

    entry = entry || findExisting(context, ['README.md', 'readme.md', 'index.md', 'default.md']);

    if (!entry) {
        console.log(chalk.red(`Failed to locate entry file in ${chalk.yellow(context)}.`));
        console.log(chalk.red('Valid entry file should be one of: readme.md, index.md, README.md or default.md.'));
        process.exit(1);
    }
    if (typeof entry === 'string' && !fs.existsSync(path.resolve(context, entry))) {
        console.log(chalk.red(`Entry file ${chalk.yellow(entry)} does not exist.`));
        process.exit(1);
    }

    return {
        context,
        entry
    };
};

exports.getAssetPath = (options, filePath) =>
    options.assetsDir ? path.posix.join(options.assetsDir, filePath) : filePath;

exports.resolveLocal = function resolveLocal(...args) {
    return path.join(__dirname, '../../', ...args);
};
