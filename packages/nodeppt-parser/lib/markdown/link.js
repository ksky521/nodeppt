module.exports = md => {
    const defLinkOpen =
        md.renderer.rules.link_open ||
        function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        // 增加 target
        const aIndex = tokens[idx].attrIndex('target');
        const hrefIndex = tokens[idx].attrIndex('href');
        if (hrefIndex >= 0) {
            // 从在 hrefIndex
            const href = tokens[idx].attrs[hrefIndex][1];
            if (href && href !== '#') {
                if (aIndex < 0) {
                    tokens[idx].attrPush(['target', '_blank']); // add new attribute
                } else {
                    tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
                }
            } else {
                // 空连接不增加 _blank 替换成 JavaScript：void
                tokens[idx].attrs[hrefIndex][1] = 'javascript:void(0)';
            }
        }

        // pass token to default renderer.
        return defLinkOpen(tokens, idx, options, env, self);
    };

};

// module.exports = md => {
//   md.use(
//     mditr(
//       /\[\!(\.\w+\s+)?(.+?)]\((.*?)\)/,
//       (match, utils) => {
//         let cls = match[1] ? match[1].slice(1).trim() : ''
//         if (cls) {
//           cls = cls.split('.').join(' ')
//         }
//         let content = match[2]
//         content = md.render(content)

//         return `<a class="button ${cls}" href="${
//           match[3] && match[3] !== '' ? match[3] : 'javascript:void(0)'
//         }">${content}</a>`
//       },
//       'button_inline'
//     )
//   )
// }
