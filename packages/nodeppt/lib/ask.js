/**
 * @file 修改字 vue-cli,prompt 收集答案
 */

const inquirer = require('inquirer');
const {evaluate} = require('nodeppt-shared-utils');

const promptMapping = {
    string: 'input',
    boolean: 'confirm'
};

module.exports = (prompts, data) => {
    const answers = {};
    let keys = Object.keys(prompts);

    return new Promise(async (resolve, reject) => {
        let key;
        while ((key = keys.shift())) {
            await prompt(answers, key, prompts[key], data);
        }
        resolve(answers);
    });
};
// 将 default 使用 templateData 渲染一下，比如作者之类的
function render(content, data) {
    if (content && /{{([^{}]+)}}/g.test(content)) {
        Object.keys(data).forEach(key => {
            if (data[key] && typeof data[key] === 'string') {
                content = content.split(new RegExp(`{{\\s*${key}\\s*}}`, 'g')).join(data[key]);
            }
        });
        return content;
    }

    return content;
}
async function prompt(data, key, prompt, tplData) {
    // 当 when 起作用的时候跳过
    if (prompt.when && !evaluate(prompt.when, data)) {
        return;
    }

    let promptDefault = prompt.default;
    if (typeof promptDefault === 'function') {
        promptDefault = function() {
            return prompt.default.bind(this)(data);
        };
    }

    const answers = await inquirer.prompt([
        {
            type: promptMapping[prompt.type] || prompt.type,
            name: key,
            message: prompt.message || prompt.label || key,
            default: render(promptDefault, tplData),
            choices: prompt.choices || [],
            validate: prompt.validate || (() => true)
        }
    ]);

    if (Array.isArray(answers[key])) {
        data[key] = {};
        answers[key].forEach(multiChoiceAnswer => {
            data[key][multiChoiceAnswer] = true;
        });
    } else if (typeof answers[key] === 'string') {
        data[key] = answers[key].replace(/"/g, '\\"');
    } else {
        data[key] = answers[key];
    }
}
