/**
 * @file 获取 git 用户名和邮箱
 */

const exec = require('child_process').execSync;

exports.getGitUser = () => {
    let name;
    let email;

    try {
        name = exec('git config --get user.name');
        email = exec('git config --get user.email');
        email = email.toString().trim();
        name = JSON.stringify(name.toString().trim()).slice(1, -1);
        const t = email && ' <' + email.toString().trim() + '>';
        return {
            name,
            email,
            author: (name || '') + (t || '')
        };
    } catch (e) {
        return {};
    }
};
