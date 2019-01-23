/**
 * @file plugin 相关
 */
const pluginRE = /^nodeppt-plugin-/;
const scopeRE = /^@[\w-]+\//;

exports.isPlugin = id => pluginRE.test(id);
exports.resolvePluginId = id => {
    // already full id
    // e.g. vue-cli-plugin-foo, @vue/cli-plugin-foo, @bar/vue-cli-plugin-foo
    if (pluginRE.test(id)) {
        return id;
    }
    // scoped short
    // e.g. @vue/foo, @bar/foo
    if (id.charAt(0) === '@') {
        const scopeMatch = id.match(scopeRE);
        if (scopeMatch) {
            const scope = scopeMatch[0];
            const shortId = id.replace(scopeRE, '');
            return `${scope}nodeppt-plugin-${shortId}`;
        }
    }
    // default short
    // e.g. foo
    return `nodeppt-plugin-${id}`;
};
