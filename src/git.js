"use strict";

var git = {};
var spawn = require("./spawn.js");

git.currentBranch = function () {
    return new Promise(function (resolve, reject) {
        var proc = require("child_process");
        proc.exec('git rev-parse --abbrev-ref HEAD', function (error, stdout, stderr) {
            if (!error) {
                resolve(stdout.trim());
            }
            else {
                reject(error);
            }
        });
    });
};

git.currentRev = function () {
    return new Promise(function (resolve, reject) {
        var proc = require("child_process");
        proc.exec('git rev-parse HEAD', function (error, stdout, stderr) {
            if (!error) {
                resolve(stdout.trim());
            }
            else {
                reject(error);
            }
        });
    });
}

module.exports = git;
