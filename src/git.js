"use strict";

var git = {};
var proc = require('child_process');

git.currentBranch = function(cb){
    proc.exec('git rev-parse --abbrev-ref HEAD',function(error, stdout, stderr){
        cb(stderr,stdout);
    });
};

module.exports = git;

