"use strict";

var	colour = require('bash-color'),
	playsound = require('./playsound.js'),
	vars = require('./vars.js');

module.exports = function(msg,type,config){
	var fancyOutput;
	config = config || vars.message;
	type = type || 'default';
	if (! (type in config) ) {
		type = 'default';
	}
	if (config[type].colour) {
		fancyOutput = colour[ config[type].colour ]( config[type].char + '  ' + msg );
	} else {
		fancyOutput = config[type].char + '  ' + msg;
	}
	playsound( config[type].sound );
	return fancyOutput;
};
