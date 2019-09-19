/**
 * 页面的 main.js
 */
import Slide from 'nodeppt-js';
if (typeof window === 'object' && Array.isArray(window.WSPlugins_)) {
    /* eslint-disable fecs-camelcase,no-undef */
    WSPlugins_.forEach(({id, apply}) => {
        /* eslint-enable fecs-camelcase,no-undef */
        Slide.registerPlugin(id, apply);
    });
}

window.WebSlides = Slide;
