"use strict";

var docker = require('../../procker.js');

var run = function(good,bad){
    docker.listContainers().then(good).catch(bad);
};

module.exports = run;
