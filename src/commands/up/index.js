"use strict";

/**
 * Open Docker Machine
 */

var childProcess = require('child_process');

var run = function(good,bad) {
    var dockerMachine = childProcess.spawn('docker-machine',['start','default']);
    var r='',err='';
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

            //  now do docker start

            good(r);
        }
    });
};

 module.exports = function(Command,scope) {
    return new Command(scope,run);
 };