"use strict";

var git = {};
var child_process = require('child_process');

git.currentBranch = function(cb){
    child_process.exec('git rev-parse --abbrev-ref HEAD',function(error, stdout, stderr){
        cb(stderr,stdout);
    });
};

module.exports = git;

