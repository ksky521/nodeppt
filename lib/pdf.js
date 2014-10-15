var page = new WebPage();
var system = require('system');

page.paperSize = {
    format: 'A3',
    orientation: 'landscape',
    margin: {
        left: '0',
        right: '0',
        top: '0',
        bottom: '0'
    }
};
page.zoomFactor = 1.5;

var revealFile = system.args[1];
var slideFile = system.args[2];
// console.log(revealFile);
if (slideFile.match(/\.pdf$/gi) === null) {
    slideFile += '.pdf';
}

console.log('Printing PDF...');

page.open(revealFile, function(status) {
    console.log('Printed succesfully');
    page.render(slideFile);
    phantom.exit();
});
