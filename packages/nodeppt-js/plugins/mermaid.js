import DOM from 'webslides/src/js/utils/dom';
import {default as Slide, Events as SlideEvents} from 'webslides/src/js/modules/slide';

export default class Echarts {
    constructor(wsInstance) {
        this.ws_ = wsInstance;

        const mermaidNode = DOM.toArray(this.ws_.el.querySelectorAll('.lang-mermaid'));

        if (mermaidNode.length) {
            mermaidNode.forEach((node, j) => {
                const {i} = Slide.getSectionFromEl(node);
                const slide = wsInstance.slides[i - 1];
                slide.mermaidInit = false;
                slide.mermaidNode = node;

                slide.el.addEventListener(SlideEvents.ENABLE, Echarts.onSectionEnter);
            });
        }
    }

    static onSectionEnter(event) {
        const slide = event.detail.slide || {};
        const {mermaidNode, mermaidInit} = slide;
        if (!mermaidInit && window.mermaid) {
            setTimeout(() => {
                const theme =
                    window.pluginsOptions && window.pluginsOptions.mermaid
                        ? window.pluginsOptions.mermaid.theme
                        : undefined;
                mermaid.initialize({
                    theme: theme ? theme : 'default'
                });
                mermaidNode.style.visibility = 'visible';
                mermaid.init(undefined, mermaidNode);
                slide.mermaidInit = true;
            }, 800);
        }
    }
}
