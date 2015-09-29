"use strict";

var colour = require('bash-color'),
    playsound = require('./playsound.js'),
    config = require('./scope.js').conf.message;

module.exports = function(msg,type,options) {
    var fancyOutput;
    var defaultOptions = {
        "withsound": true,
        "config": config
    };
    if (typeof options === "undefined") {
        options = {};
    }
    options = Object.assign(options,defaultOptions);
    type = type || 'default';
    if (!(type in options.config)) {
        type = 'default';
    }
    if (options.config[type].colour) {
        fancyOutput = colour[ options.config[type].colour ]( options.config[type].char + '  ' + msg );
    } else {
        fancyOutput = options.config[type].char + '  ' + msg;
    }
    if (options.withsound) {
        playsound( options.config[type].sound );    
    }
    return fancyOutput;
};
