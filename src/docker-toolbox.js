"use strict";

var Docker = require('dockerode'),
    fs = require('fs'),
    childProcess = require('child_process'),
    fancy = require('./fancy')

const machineName = 'default';

var d = new Docker({
    host: process.env.DOCKER_HOST.replace(/:\d+$/,'').replace(/^\D+/,'') || '192.168.99.100',
    port: process.env.DOCKER_HOST.replace(/^.*:/,'') || 2376,
    ca: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/ca.pem', {encoding: "utf8"}),
    cert: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/cert.pem', {encoding: "utf8"}),
    key: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/key.pem', {encoding: "utf8"})
});

var machineExec = function(args,cb) {
    //var machineName = 'default';
    var err=null, r=null;
    args.push(machineName);
    var proc = childProcess.spawn('docker-machine',args);
    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');
    proc.stdout.on('data',function(data) {
        if (data) {
            if (r) {
                r = r + data;
            } else {
                r = data;
            }
        }
    });
    proc.stderr.on('data',function(data) {
        err = data;
    });
    proc.on('close',function(exitCode) {
        if (exitCode !== 0) {
            err = 'exit code ' + exitCode;
        } else if (r) {
            r = fancy(r);
        }
        cb(err,r);
    });
};

var D = {
    'docker': d,
    'compose': {},
    'machine': {
        getStatus: function(cb) {
            machineExec(['status'],cb);            
        }
    }
};

module.exports = D;