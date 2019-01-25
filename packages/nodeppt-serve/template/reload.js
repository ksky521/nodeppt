if (module.hot) {
    var hotEmitter = require('webpack/hot/emitter');
    hotEmitter.on('webpackHotUpdate', function(currentHash) {
        location.reload();
    });
} else {
    throw new Error('[HMR] Hot Module Replacement is disabled.');
}
