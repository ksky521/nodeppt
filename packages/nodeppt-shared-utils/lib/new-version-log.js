const chalk = require('chalk');
const boxen = require('boxen');
exports.newVersionLog = (currentVersion, newVersion) => {
    if (newVersion) {
        const message = `Update available ${chalk.dim(currentVersion)} → ${chalk.green(newVersion)}
Run ${chalk.cyan('npm i -g nodeppt')} to update`;

        console.error(
            boxen(message, {
                padding: 1,
                margin: 1,
                align: 'center',
                borderColor: 'yellow',
                borderStyle: 'round'
            })
        );
    }
};
