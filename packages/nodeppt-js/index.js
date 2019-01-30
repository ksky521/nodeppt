import WebSlides from 'webslides/src/js/modules/webslides';
import './assets/scss/full.scss';
import './assets/scss/index.scss';
import 'animate.css';
// import ItemBuild from './lib/item-build';
import Keyboard from './plugins/keyboard';
import SpeakerMode from './plugins/speaker-mode';
import SpeakerNote from './plugins/speaker-note';
import Echarts from './plugins/echarts';

WebSlides.registerPlugin('echarts', Echarts);
WebSlides.registerPlugin('keyboard', Keyboard);
WebSlides.registerPlugin('speakermode', SpeakerMode);
WebSlides.registerPlugin('speakernote', SpeakerNote);
export default WebSlides;
