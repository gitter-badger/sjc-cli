"use strict";

<<<<<<< HEAD
var docker = require('../../procker.js');
=======
var docker = require('../../docker-toolbox.js').docker;
>>>>>>> 78b0398ba3e4e66704969956305b14611f57805c

var run = function(good,bad){
    docker.listContainers().then(good).catch(bad);
};

module.exports = run;
