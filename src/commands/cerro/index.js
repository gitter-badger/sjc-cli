"use strict";

var Command = require('../../Command.js');
var Docker = require('dockerode');
var fs = require('fs');
var git = require('../../git.js');

var d = new Docker({
    host: process.env.DOCKER_HOST.replace(/:\d+$/,'').replace(/^\D+/,'') || '192.168.59.103',
    port: process.env.DOCKER_HOST.replace(/^.*:/,'') || 2376,
    ca: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/ca.pem', {encoding: "utf8"}),
    cert: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/cert.pem', {encoding: "utf8"}),
    key: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/key.pem', {encoding: "utf8"})
});

var container = d.getContainer('10e2e55276ab');

var run = function(good,bad){
    container.inspect(function (err, containerdata) {
        if (err) {
            console.error(err);
            bad(err);
        } else {
            git.currentBranch(function(err, branch){
                if (err) {
                    bad(err);
                } else {
                    var r = {
                        ports: JSON.stringify(containerdata.NetworkSettings.Ports),
                        gitBranch: branch.trim()
                    };
                    good(r);                    
                }
            });
        }
    });
};

module.exports = function(scope) {
    return new Command(scope,run);
};