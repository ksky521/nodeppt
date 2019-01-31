/**
 * @file 下载 icon repo
 */
const gitclone = require('git-clone');
const rm = require('fs-extra').removeSync;
const debug = require('./get-debug').getDebugLogger('download-repo');

const {getGitUser} = require('./git-user');

exports.downloadRepo = (repo, dest, opts = {}, fn) => {
    repo = normalize(repo, opts);
    const {url, checkout} = repo;

    gitclone(url, dest, {checkout, shallow: checkout === 'master'}, err => {
        if (!err) {
            rm(`${dest}/.git`);
            fn();
        } else {
            fn(err);
            debug(err, url, dest, checkout);
        }
    });
};
function normalize(repo, opts) {
    // 公司名/目录名/repo#分支
    const regex = /^(?:(github|gitlab|bitbucket|coding)\:)?(?:([^\/]+)\/)?([^#]+)(?:#(.+))?$/;
    const useHttps = opts.https || false;

    const match = regex.exec(repo);
    if (!match) {
        return {
            url: repo,
            checkout: 'master'
        };
    }

    const [m, source = 'github', product = 'ksky521', repoName, checkout = 'master'] = match;
    let url = repo;
    switch (source) {
        case 'github':
        case 'gitlab':
        case 'bitbucket':
            if (useHttps) {
                // https://github.com/vuejs-templates/pwa.git
                url = `https://${source}.com/${product}/${repoName}.git`;
            } else {
                // git@github.com:vuejs-templates/pwa.git
                url = `git@${source}.com:${product}/${repoName}.git`;
            }
            break;
        case 'coding':
            if (useHttps) {
                url = `https://git.coding.net/${product}/${repoName}.git`;
            } else {
                url = `git@git.coding.net:${product}/${repoName}.git`;
            }
            break;
    }
    return {
        url,
        checkout
    };
}
