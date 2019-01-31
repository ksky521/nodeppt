const {mergeAttrs} = require('../utils');

const {getAttrs, getAttrsString} = require('../markdown/attrs/utils');

/**
 * <slide image="url .abc" video="url .abc poster_url">
 */
module.exports = tree => {
    tree.match({tag: 'slide'}, node => {
        node.tag = 'section';
        node.attrs = mergeAttrs(
            {
                slide: true,
                class: 'slide'
            },
            node.attrs
        );
        const attrs = node.attrs;
        const wrapAttrs = {};
        for (let i in attrs) {
            if (i.startsWith(':')) {
                // 这是 wrap 的样式
                wrapAttrs[i.slice(1)] = attrs[i];
            }
        }
        if (Object.keys(wrapAttrs).length > 0) {
            node.content.forEach(node => {
                if (node && node.tag === 'div' && node.attrs && node.attrs.wrap) {
                    node.attrs = mergeAttrs(node.attrs, wrapAttrs);
                }
            });
        }

        if (attrs.image) {
            let [image, ...imgAttrs] = attrs.image.split(/\s+/);
            imgAttrs = getAttrs(`{${imgAttrs.join(' ')}}`, 0, {
                leftDelimiter: '{',
                rightDelimiter: '}'
            });
            const rs = {};
            let cls = [];
            let noBackgroundClass = false;
            if (imgAttrs.length) {
                imgAttrs.forEach(([key, value]) => {
                    if (key === 'class') {
                        cls = value.split('.').map(c => {
                            if (!['dark', 'light', 'anim'].includes(c)) {
                                if (
                                    [
                                        'top',
                                        'bottom',
                                        'right',
                                        'right-top',
                                        'right-bottom',
                                        'center',
                                        'center-top',
                                        'center-bottom',
                                        'left',
                                        'left-top',
                                        'left-bottom'
                                    ].includes(c)
                                ) {
                                    noBackgroundClass = true;
                                }
                                return `background-${c}`;
                            }

                            return c;
                        });
                    } else {
                        rs[key] = value;
                    }
                });
            }

            node.content.unshift({
                tag: 'span',
                attrs: {
                    ...rs,
                    class: [noBackgroundClass ? '' : 'background', ...cls].join(' '),
                    style: `background-image:url('${image}')`
                }
            });
        } else if (attrs.youtube) {
            const ybAttrs = getAttrs(`{${attrs.youtube}}`, 0, {
                leftDelimiter: '{',
                rightDelimiter: '}'
            });
            const rs = {
                'data-youtube': '',
            };
            let cls = [];
            if (ybAttrs.length) {
                ybAttrs.forEach(([key, value]) => {
                    if (key === 'class') {
                        cls = value.split('.').map(c => {
                            return c;
                        });
                    }else if(key==='id'){
                        key = 'youtube-id'
                    }
                    rs[`data-${key}`] = value.replace(/^[\'\"]|[\'\"]$/g, '');
                });
            }
            if (cls.length === 0) {
                cls.push('dark');
            }
            cls.push('embed');
            node.content.unshift({
                tag: 'div',
                attrs: {class: cls.join(' ')},
                content: [
                    {
                        tag: 'div',
                        attrs: rs
                    }
                ]
            });
        } else if (attrs.video) {
            let [src, ...videoAttrs] = attrs.video.split(/\s+/);
            videoAttrs = getAttrs(`{${videoAttrs.join(' ')}}`, 0, {
                leftDelimiter: '{',
                rightDelimiter: '}'
            });
            let rs = {};
            let cls = [];
            if (videoAttrs.length) {
                videoAttrs.forEach(([key, value]) => {
                    if (key === 'class') {
                        cls = value.split('.').map(c => {
                            if (!['dark', 'light'].includes(c)) {
                                return `background-video-${c}`;
                            }
                            return c;
                        });
                    } else {
                        // console.log(value);
                        rs[key] = value.replace(/^\'|\'$/g, '');
                    }
                });
            }
            rs = Object.assign(rs, {loop: true, muted: true});
            const videoAttr = {
                ...rs,
                autoplay: 'autoplay',
                preload: 'true',
                class: ['background-video', ...cls].join(' ')
            };
            // 支持多个
            src = src.split(',').map(s => {
                return {tag: 'source', attrs: {src: s}};
            });
            node.content.unshift({
                tag: 'video',
                attrs: videoAttr,
                content: src
            });
            /**
   * <video class="background-video dark" loop="" muted="" poster="https://webslides.tv/static/images/peggy.jpg">
            <source src="https://webslides.tv/static/videos/peggy.mp4" type="video/mp4">
          </video>
   */
        }
        return node;
    });
};
