import DOM from 'webslides/src/js/utils/dom';
import {default as Slide, Events as SlideEvents} from 'webslides/src/js/modules/slide';

export default class SpeakerNote {
    constructor(wsInstance) {
        this.ws_ = wsInstance;

        const $note = DOM.toArray(this.ws_.el.querySelectorAll('.note'));

        if ($note.length) {
            $note.forEach((note, j) => {
                const {i} = Slide.getSectionFromEl(note);
                const slide = wsInstance.slides[i - 1];
                slide.noteNode = note;
                slide.el.addEventListener(SlideEvents.ENABLE, SpeakerNote.onSectionEnter);
                slide.el.addEventListener(SlideEvents.DISABLE, SpeakerNote.onSectionDisabled);
            });
        }
    }
    static toggleNote(e) {
        if (e.which === 110 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
            // toggleNote
            // console.log(this); // node
            this.classList.toggle('show');
        }
    }
    static onSectionDisabled(event) {
        const $node = event.detail.slide.noteNode;
        $node.removeEventListener('keypress', SpeakerNote.toggleNote.bind($node));
    }
    static onSectionEnter(event) {
        const $node = event.detail.slide.noteNode;

        $node.addEventListener('keypress', SpeakerNote.toggleNote.bind($node));
    }
}
