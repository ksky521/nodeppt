import Keys from 'webslides/src/js//utils/keys';
import DOM from 'webslides/src/js/utils/dom';

/**
 * Keyboard interaction plugin.
 * 修改原生的 keyboard，支持单条 build
 */
export default class Keyboard {
    /**
     * @param {WebSlides} wsInstance The WebSlides instance
     * @constructor
     */
    constructor(wsInstance) {
        /**
         * @type {WebSlides}
         * @private
         */
        this.ws_ = wsInstance;
        this.enable_ = false;
        this.init_();
        this.bindEvent_();
    }
    bindEvent_() {
        const el = this.ws_.el;
        el.addEventListener('ws:slide-change', this.slideBuild_.bind(this), false);

        document.addEventListener('keydown', this.onKeyPress_.bind(this), false);
        // 接受远程控制事件
        document.addEventListener('control:keydown', this.onKeyPress_.bind(this), false);
    }
    init_() {
        const toBuildNode = toArray(this.ws_.el.querySelectorAll('.build>*'));
        if (toBuildNode.length) {
            toBuildNode.forEach(node => {
                node.classList.add('tobuild');
            });
        }
    }
    /**
     * Reacts to the keydown event. It reacts to the arrows and space key
     * depending on the layout of the page.
     * @param {KeyboardEvent} event The key event.
     * @private
     */
    onKeyPress_(event) {
        let method;
        let argument;

        if (DOM.isFocusableElement() || this.ws_.isDisabled()) {
            return;
        }

        switch (event.which) {
            case Keys.AV_PAGE:
                method = this.enable_ ? this.goNext : this.ws_.goNext;
                break;
            case Keys.SPACE:
                if (event.shiftKey) {
                    method = this.enable_ ? this.goPrev : this.ws_.goPrev;
                } else {
                    method = this.enable_ ? this.goNext : this.ws_.goNext;
                }
                break;
            case Keys.RE_PAGE:
                method = this.enable_ ? this.goPrev : this.ws_.goPrev;
                break;
            case Keys.HOME:
                method = this.ws_.goToSlide;
                argument = 0;
                break;
            case Keys.END:
                method = this.ws_.goToSlide;
                argument = this.ws_.maxSlide_ - 1;
                break;
            case Keys.DOWN:
                method = this.ws_.isVertical ? (this.enable_ ? this.goNext : this.ws_.goNext) : null;
                break;
            case Keys.UP:
                method = this.ws_.isVertical ? (this.enable_ ? this.goPrev : this.ws_.goPrev) : null;
                break;
            case Keys.RIGHT:
                method = !this.ws_.isVertical ? (this.enable_ ? this.goNext : this.ws_.goNext) : null;
                break;
            case Keys.LEFT:
                method = !this.ws_.isVertical ? (this.enable_ ? this.goPrev : this.ws_.goPrev) : null;
                break;

            case Keys.F:
                if (!event.metaKey && !event.ctrlKey) {
                    method = this.ws_.fullscreen;
                }

                break;
        }
        if (method) {
            method.call(this.enable_ ? this : this.ws_, argument);
            // Prevents Firefox key events.
            event.preventDefault();
        }
    }
    //单行前进
    goNext() {
        const $curSlide = this.curSlide_.el;

        const subBuilded = toArray($curSlide.querySelectorAll('.building'));
        let list;
        if (subBuilded.length) {
            while ((list = subBuilded.shift())) {
                list = list.classList;
                list.remove('building');
                list.add('builded');
            }
        }
        const toBuild = toArray($curSlide.querySelectorAll('.tobuild'));

        if (!toBuild.length) {
            // 继续下一页
            this.enable_ = false;
            this.ws_.goNext();

            return false;
        }

        const item = toBuild[0];
        list = item.classList;
        list.remove('tobuild');

        list.add('building');
        return true;
    }

    //单条往后走
    goPrev() {
        const $curSlide = this.curSlide_.el;

        const subBuilded = toArray($curSlide.querySelectorAll('.building'));

        let list;
        let buildingLen = subBuilded.length;
        let curList;

        if (buildingLen) {
            while ((list = subBuilded.shift())) {
                let clist = list.classList;
                clist.remove('building');
                clist.add('tobuild');
                curList = list;
            }
        }
        const builded = toArray($curSlide.querySelectorAll('.builded'));

        if (!builded.length && !buildingLen) {
            // 继续下一页
            this.enable_ = false;
            this.ws_.goPrev();
            return false;
        }

        let item = builded.pop();
        if (item) {
            if (!curList) {
                curList = item;
            }
            list = item.classList;
            list.remove('builded');
            if (buildingLen === 0) {
                list.add('tobuild');
                item = builded.pop();
                if (item) {
                    item.classList.remove('builded');
                    item.classList.add('building');
                }
            } else {
                list.add('building');
            }
        }
        return true;
    }
    slideBuild_(e) {
        // 处理现在的内容
        if (e && e.detail) {
            const idx = e.detail.currentSlide0;
            const slide = this.ws_.slides[idx];
            this.curSlide_ = slide;
            const buildNode = toArray(slide.el.querySelectorAll('.tobuild,.builded'));
            if (buildNode.length) {
                this.enable_ = true;
                return;
            }
        }
        this.enable_ = false;
    }
}

const emptyArr = [];

//泛数组转换为数组
function toArray(arrayLike) {
    return emptyArr.slice.call(arrayLike);
}
