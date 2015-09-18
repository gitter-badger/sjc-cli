"use strict";


/**
 * Spin down docker machine. Takes no arguments. simply invoked "docker-machine stop default"
 * @returns (stdout) - whatever the docker-machine command said
 */

var childProcess = require('child_process');

var run = function(good,bad) {
    var dockerMachine = childProcess.spawn('docker-machine',['stop','default']);
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
            good(r);
        }
    });
};

 module.exports = function(Command,scope) {
    return new Command(scope,run);
 };