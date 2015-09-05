"use strict";

/**
<<<<<<< HEAD
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
=======
 * Open Docker Machine
 */

var childProcess = require('child_process');

var run = function(good,bad) {
    var dockerMachine = childProcess.spawn('docker-machine',['start','default']);
    var r='',err='';
    dockerMachine.stdout.setEncoding('utf8');
    dockerMachine.stdout.on('data',function(data) {
        r += data;
    });
    dockerMachine.stderr.on('data',function(data) {
        err += data;
    });
    dockerMachine.on('close',function(code) {
        if (code !== 0) {
            err = Error('Process exited with error code ' + code);
        }
        if (err) {
            bad(err);
        } else {
            //  now start docker
            good(r);
        }
    });
};

 module.exports = function(Command,scope) {
    return new Command(scope,run);
 };
>>>>>>> 78b0398ba3e4e66704969956305b14611f57805c
