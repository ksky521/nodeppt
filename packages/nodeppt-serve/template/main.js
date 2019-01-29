/**
 * 页面的 main.js
 */
import Slide from 'nodeppt-js';
if (typeof window === 'object' && Array.isArray(window.WSPlugins_)) {
    WSPlugins_.forEach(({id, apply}) => {
        Slide.registerPlugin(id, apply);
    });
}

window.WebSlides = Slide;
