import WebSlides from 'webslides/src/js/modules/webslides';
import './assets/scss/full.scss';
import './assets/scss/index.scss';
// import ItemBuild from './lib/item-build';
import Keyboard from './lib/keyboard';
import SpeakerMode from './lib/speaker-mode';

WebSlides.registerPlugin('keyboard', Keyboard);
WebSlides.registerPlugin('speakermode', SpeakerMode);
export default WebSlides;
