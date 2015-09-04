"use strict";

/**
 * Turns on Docker Machine
 * @example: sjc up
 * 
 */

var Command = require('../../Command.js'),
    childProcess = require('child_process');

var run = function(good,bad){
    childProcess.spawn('')
};

module.exports = function(scope){
    return new Command(scope,run);
};