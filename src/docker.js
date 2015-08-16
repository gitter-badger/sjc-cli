"use strict";

var Docker = require('dockerode'),
    fs = require('fs');

var d = new Docker({
    host: process.env.DOCKER_HOST.replace(/:\d+$/,'').replace(/^\D+/,'') || '192.168.59.103',
    port: process.env.DOCKER_HOST.replace(/^.*:/,'') || 2376,
    ca: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/ca.pem', {encoding: "utf8"}),
    cert: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/cert.pem', {encoding: "utf8"}),
    key: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/key.pem', {encoding: "utf8"})
});

module.exports = d;