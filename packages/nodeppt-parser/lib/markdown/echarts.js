module.exports = md => {
    const temp = md.renderer.rules.fence.bind(md.renderer.rules);
    md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        const code = token.content.trim();
        if (token.info === 'echarts') {
            try {
                // 这里特殊处理下！
                const json = (1, eval)(`(function(){return ${code};})()`);
                let attrs = token.attrs || [];
                attrs = attrs.map(([key, value]) => {
                    return `${key}="${value}"`;
                }).join(' ')
                return `<div class="embed"><div class="echarts" ${attrs}></div></div><div class="echarts-data" style='display:none'>${JSON.stringify(
                    json
                )}</div>`;
            } catch (err) {
                return `<pre>${err}</pre>`;
            }
        }
        return temp(tokens, idx, options, env, slf);
    };
};
