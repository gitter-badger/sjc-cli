"use strict";

/**
 * play a sound in a detached process, but fail silently if you can't
 * completely ignores stout and stderr
 * @returns { nothing } undefined
 */

var spawn = require('child_process').spawn,
	vars = require('./vars.js');
const CLIP_ROOT = __dirname + '/assets/';

var playsound = function(clipname){
	var clip_path = CLIP_ROOT + clipname;
	var command = '/usr/bin/env';
	var args = ['afplay','-v', vars.soundEffects.volume ,clip_path];
	var options = {
		stdio: ['ignore','ignore','ignore'],
		detached: true
	};
	var clip = spawn(command,args,options);
	clip.unref();
	return;
};

module.exports = playsound;
