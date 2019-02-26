import DOM from 'webslides/src/js/utils/dom';
import {default as Slide, Events as SlideEvents} from 'webslides/src/js/modules/slide';
const HEIGHT = 0.2;
const SCALE = 1.5;
export default class SpeakerNote {
    constructor(wsInstance) {
        this.ws_ = wsInstance;
        this.isSpeakerMode_ = this.ws_.el.classList.contains('with-note');

        const $note = DOM.toArray(this.ws_.el.querySelectorAll('.speaker-note'));

        if ($note.length) {
            $note.forEach((note, j) => {
                const {i} = Slide.getSectionFromEl(note);
                const slide = wsInstance.slides[i - 1];
                slide.noteNode = note;
                if (!this.isSpeakerMode_) {
                    slide.el.addEventListener(SlideEvents.ENABLE, SpeakerNote.onSectionEnter);
                    slide.el.addEventListener(SlideEvents.DISABLE, SpeakerNote.onSectionDisabled);
                }
            });
        }
    }

    static toggleNote(e) {
        // console.log(e);
        if (e.which === 110 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
            // toggleNote
            this.classList.toggle('show');
        }
    }
    static onSectionDisabled(event) {
        const $slide = event.detail.slide;
        document.removeEventListener('keypress', SpeakerNote.toggleNote.bind($slide.noteNode));
    }
    static onSectionEnter(event) {
        const $slide = event.detail.slide;
        document.addEventListener('keypress', SpeakerNote.toggleNote.bind($slide.noteNode));
    }
}
