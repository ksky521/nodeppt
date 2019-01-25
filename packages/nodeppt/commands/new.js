/**
 * @file init 初始化项目
 */
const path = require('path');
const fs = require('fs-extra');

const home = require('user-home');
const inquirer = require('inquirer');

const exists = fs.existsSync;
const rm = fs.removeSync;

const generate = require('../lib/generate');

const {
    chalk,
    isLocalPath,
    getTemplatePath,
    error,
    updateSpinner,
    logWithSpinner,
    stopSpinner,
    log,
    downloadRepo,
    clearConsole
} = require('nodeppt-shared-utils');
const ALIAS_MAP = process.env.alias || {
    default: 'ksky521/nodeppt-template-default'
};
const alias = name => {
    if (ALIAS_MAP[name]) {
        return ALIAS_MAP[name];
    }

    return name;
};
module.exports = async (template, dest, opts) => {
    template = alias(template || 'default');
    const inPlace = !dest || dest === '.';
    const name = inPlace ? path.relative('../', process.cwd()) : appName;
    dest = path.resolve(dest || '.');

    if (exists(dest)) {
        if (opts.force) {
            await fs.remove(dest);
        } else {
            clearConsole();
            if (inPlace) {
                const {ok} = await inquirer.prompt([
                    {
                        name: 'ok',
                        type: 'confirm',
                        message: 'Generate file in current directory?'
                    }
                ]);
                if (!ok) {
                    return;
                }
            } else {
                const {action} = await inquirer.prompt([
                    {
                        name: 'action',
                        type: 'list',
                        message: 'Target directory exists. Continue?：',
                        choices: [
                            {name: 'overwrite', value: 'overwrite'},
                            {name: 'merge', value: 'merge'},
                            {name: 'cancel', value: false}
                        ]
                    }
                ]);
                if (!action) {
                    return;
                } else if (action === 'overwrite') {
                    log(`delete ${chalk.cyan(dest)}...`);
                    await fs.remove(dest);
                }
            }
        }
    }

    const isOffline = opts.offline;
    if (isOffline || isLocalPath(template)) {
        // 使用离线地址
        // 直接复制，不下载 icode 代码
        const templatePath = getTemplatePath(template);
        if (exists(templatePath)) {
            generate(name, templatePath, dest, opts);
        } else {
            error('Template not found');
        }
    } else {
        // 临时存放地址，存放在~/.nodeppt-templates 下面
        let tmp = path.join(home, '.nodeppt-templates', template.replace(/[/:#]/g, '-'));

        if (opts.cache && exists(tmp)) {
            // 优先使用缓存
            generate(name, tmp, dest, opts);
        } else {
            clearConsole();
            logWithSpinner('🗃', 'Download...');
            if (exists(tmp)) {
                rm(tmp);
            }

            downloadRepo(template, tmp, opts, err => {
                if (!err) {
                    updateSpinner('🗃', 'Template download success！');
                } else {
                    updateSpinner('❌', 'Template download error!');
                }
                stopSpinner();
                console.log();
                if (!err) {
                    generate(name, tmp, dest, opts);
                } else {
                    error('Failed to download repo ' + template + ': ' + err.message.trim());
                    if (!process.env.DEBUG) {
                        log(`Use「${chalk.bgYellow.black('DEBUG=*')}」 to get more info`);
                    }
                }
            });
        }
    }
};
