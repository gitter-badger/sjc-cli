"use strict";

var git = {};
var proc = require('child_process');

git.currentBranch = function(cb){
    proc.exec('git rev-parse --abbrev-ref HEAD | tr -d "\n"',function(error, stdout, stderr) {
        cb(stderr, stdout);
    });
};

git.currentRev = function(cb) {
    proc.exec('git rev-parse HEAD | tr -d "\n"',function(error, stdout, stderr) {
        cb(stderr, stdout);
    });
};

git.getRemotes = function(cb) {
    proc.exec('git remote -v | tr -d "\n"',function(error, stdout, stderr){
        var remotes = {};
        stdout.split("\n").forEach(function(row) {
            var cols = row.split(/\s+/);
            var name = cols[0].trim();
            var url = cols[1].trim()
            remotes[name] = url;
        });
        cb(stderr, remotes);
    });
};

module.exports = git;
