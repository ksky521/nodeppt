// import Keyboard from 'webslides/src/js/plugins/keyboard';

export default class SpeakerMode {
    constructor(wsInstance) {
        this.ws_ = wsInstance;
        this.init_();
    }
    bindEvent_() {
        window.addEventListener('message', this.evtHandler_, false);
        document.addEventListener('keydown', this.onKeyPress_.bind(this), false);
    }
    onKeyPress_(e) {
        if ((e.detail && e.detail.salt) || !this.listener_) {
            // 处理过了，防止事件重复处理
            return;
        }
        this.listener_.postMessage({which: e.which, shiftKey: e.shiftKey}, '*');
    }
    evtHandler_(e) {
        // 发送自定义事件
        const data = e.data;
        const {which, shiftKey} = data;
        const event = new CustomEvent('control:keydown', {
            detail: {
                salt: true
            }
        });
        event.which = which;
        event.shiftKey = shiftKey;
        document.dispatchEvent(event);
    }
    init_() {
        const params = parseQuery();
        if (params.mode === 'speaker') {
            this.ws_.el.classList.add('with-note');
            const url = location.href.replace('mode=speaker', 'mode=audience');

            const sWidth = screen.width;
            const sHeight = screen.height;
            const tWidth = sWidth * 0.8;
            const tHeight = sHeight * 0.8;

            const temp =
                `height=${tHeight},width=${tWidth},top=10,left=${(sWidth - tWidth) / 2}` +
                ',toolbar=no,menubar=no,location=yes,resizable=yes,scrollbars=no,status=no';

            this.listener_ = this.popup_ = window.open(url, 'ppt', temp);
            window.addEventListener('beforeunload', this.closeClient_.bind(this), false);
            this.bindEvent_();
        } else if (params.mode === 'audience') {
            this.listener_ = window.opener;
            this.bindEvent_();
        }
    }
    closeClient_() {
        if (this.popup_ && this.popup_.close) {
            this.popup_.close();
        }
    }
}

function parseQuery(url) {
    let back = {};
    (url || location.search.substring(1)).split('&').forEach(v => {
        v = v.split('=');
        back[v[0].toLowerCase()] = v[1];
    });
    return back;
}
