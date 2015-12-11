"use strict";

/**
 * play a sound in a detached process, but fail silently if you can't
 * completely ignores stout and stderr
 * @returns { nothing } undefined
 */

var spawn = require('child_process').spawn,
    scope = require('./scope.js');
const CLIP_ROOT = __dirname + '/assets/';

var darwinParams = function(clipPath) {
    var command = '/usr/bin/env';
    var args = ['afplay','-v','0.2',clipPath + '.mp3'];
    var options = {
        stdio: ['ignore','ignore','ignore'],
        detached: true
    };
    var r = {};
    r.command = command;
    r.args  = args;
    r.options = options;
    return r;
};

var ubuntuParams = function(clipPath) {
    var command = '/usr/bin/env';
    var args = ['aplay',clipPath + '.wav'];
    var options = {
        stdio: ['ignore','ignore','ignore'],
        detached: true
    };
    var r = {};
    r.command = command;
    r.args  = args;
    r.options = options;
    return r;
};

var playsound = function(clipname){
    var clipPath = CLIP_ROOT + clipname;
    var params = {};
    switch (process.platform.toLowerCase()) {
        case 'linux':
        params = ubuntuParams(clipPath);
        break;
        default:
        params = darwinParams(clipPath);
        break;
    }
    var clip = spawn(params.command,params.args,params.options);
    clip.unref();
    return;
};

module.exports = playsound;
