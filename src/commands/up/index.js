"use strict";

/**
 * Open Docker Machine
 */

var childProcess = require('child_process');

var run = function(good,bad) {
    var proc = childProcess.spawn('docker-machine',['start','default']);
    var r,err;
    proc.stdout.on('data',function(data){
        r = data;
    });
    proc.stderr.on('data',function(data){
        err = data;
    });
    proc.on('close',function(code){
        if (code !== 0) {
            console.log(err);
            err = Error('Process exited with error code ' + code);

        }
        if (err) {
            bad(err);
        } else {
            good(data);
        }
    });
};

 module.exports = function(Command,scope) {
    return new Command(scope,run);
 };