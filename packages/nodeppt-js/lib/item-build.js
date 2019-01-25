// import Keyboard from 'webslides/src/js/plugins/keyboard';
import Keys from 'webslides/src/js//utils/keys';
import DOM from 'webslides/src/js/utils/dom';
export default class ItemBuild {
    constructor(wsInstance) {
        this.ws = wsInstance;
        this.enable_ = false;
        this.firstKiss = false;
        this.init();
        this.bindEvent();
    }
    init() {
        const toBuildNode = toArray(this.ws.el.querySelectorAll('.build>*'));
        if (toBuildNode.length) {
            toBuildNode.forEach(node => {
                node.classList.add('tobuild');
            });
        }
    }
    bindEvent() {
        const el = this.ws.el;
        el.addEventListener('ws:slide-change', this.slideBuild.bind(this), false);
        el.addEventListener(
            'ws:init',
            () => {
                this.firstKiss = !this.firstKiss;
            },
            false
        );
        document.addEventListener('keydown', this.onKeyPress_.bind(this), false);
    }
    //单行前进
    goNext() {
        if (this.firstKiss) {
            this.firstKiss = !this.firstKiss;
            return true;
        }
        const $curSlide = this.curSlide.el;

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
            this.ws.enable();
            this.ws.goNext();

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
        if (this.firstKiss) {
            this.firstKiss = !this.firstKiss;
            return true;
        }
        const $curSlide = this.curSlide.el;

        const subBuilded = toArray($curSlide.querySelectorAll('.building'));

        let list;
        let buildingLen = subBuilded.length;
        let curList;

        if (buildingLen) {
            while ((list = subBuilded.shift())) {
                var clist = list.classList;
                clist.remove('building');
                clist.add('tobuild');
                curList = list;
            }
        }
        const builded = toArray($curSlide.querySelectorAll('.builded'));

        if (!builded.length && !buildingLen) {
            // 继续下一页
            this.enable_ = false;
            this.ws.enable();
            this.ws.goPrev();
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
                item.classList.remove('builded');
                item.classList.add('building');
            } else {
                list.add('building');
            }
        }
        return true;
    }
    onKeyPress_(event) {
        if (DOM.isFocusableElement() || !this.ws.isDisabled() || !this.enable_) {
            return;
        }
        let method;
        switch (event.which) {
            case Keys.AV_PAGE:
                method = this.goNext;
                break;
            case Keys.SPACE:
                if (event.shiftKey) {
                    method = this.goPrev;
                } else {
                    method = this.goNext;
                }
                break;
            case Keys.RE_PAGE:
                method = this.goPrev;
                break;
            case Keys.DOWN:
                method = this.ws.isVertical ? this.goNext : null;
                break;
            case Keys.UP:
                method = this.ws.isVertical ? this.goPrev : null;
                break;
            case Keys.LEFT:
                method = !this.ws.isVertical ? this.goPrev : null;
                break;
            case Keys.RIGHT:
                method = !this.ws.isVertical ? this.goNext : null;
                break;
        }
        if (method) {
            method.call(this);
            // Prevents Firefox key events.
            event.preventDefault();
        }
    }
    slideBuild(e) {
        // 处理现在的内容
        if (e && e.detail) {
            const idx = e.detail.currentSlide0;
            const slide = this.ws.slides[idx];
            this.curSlide = slide;
            this.curSlideIdx = idx;
            const buildNode = toArray(slide.el.querySelectorAll('.build'));
            if (buildNode.length) {
                this.firstKiss = !this.firstKiss;
                this.enable_ = true;
                this.ws.disable();
                return;
            }
        }
        this.enable_ = false;
        this.ws.enable();
    }
}

const emptyArr = [];

//泛数组转换为数组
function toArray(arrayLike) {
    return emptyArr.slice.call(arrayLike);
}
