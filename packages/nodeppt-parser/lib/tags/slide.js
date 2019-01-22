const {mergeAttrs} = require('../utils')
/**
 * <slide image="url@.abc" video="url@.abc@poster_url">
 */
module.exports = tree => {
  tree.match({tag: 'slide'}, node => {
    node.tag = 'section'
    node.attrs = mergeAttrs(
      {
        slide: true,
        class: 'slide'
      },
      node.attrs
    )
    const attrs = node.attrs
    const wrapAttrs = {}
    for (let i in attrs) {
      if (i.startsWith(':')) {
        wrapAttrs[i.slice(1)] = attrs[i]
      }
    }
    if (Object.keys(wrapAttrs).length > 0) {
      node.content.forEach(node => {
        if (node && node.tag === 'div' && node.attrs && node.attrs.wrap) {
          node.attrs = mergeAttrs(node.attrs, wrapAttrs)
        }
      })
    }

    if (attrs.image) {
      let [image, cls = ''] = attrs.image.split('@')
      cls = cls
        .split('.')
        .filter(c => c)
        .map(c => {
          if (!['dark', 'light'].includes(c)) {
            return `background-${c}`
          }
          return c
        })
      node.content.unshift({
        tag: 'span',
        attrs: {
          class: ['background', ...cls].join(' '),
          style: `background-image:url('${image}')`
        }
      })
    } else if (attrs.video) {
      let [src, cls = '', poster = ''] = attrs.video.split('@')
      if (/\//.test(cls)) {
        poster = cls
        cls = ''
      }
      cls = cls
        .split('.')
        .filter(c => c)
        .map(c => {
          if (!['dark', 'light'].includes(c)) {
            return `background-video-${c}`
          }
          return c
        })
      const videoAttr = {
        class: ['background-video', ...cls].join(' '),
        loop: true,
        muted: true
      }
      if (poster) {
        videoAttr.poster = poster
      }
      node.content.unshift({
        tag: 'video',
        attrs: videoAttr,
        content: [{tag: 'source', attrs: {src}}]
      })
      /**
   * <video class="background-video dark" loop="" muted="" poster="https://webslides.tv/static/images/peggy.jpg">
            <source src="https://webslides.tv/static/videos/peggy.mp4" type="video/mp4">
          </video>
   */
    }
    return node
  })
}
