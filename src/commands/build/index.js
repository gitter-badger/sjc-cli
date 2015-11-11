"use strict";

/**
 * Do the docker build. Currently this expects and exectutes build.sh in the app's root folder. 
 * @todo Make this not depend on ./build.sh, but rather get all required information from git and appdef
 * @returns {String} whatever the docker build command said
 * @example sjc build
 */

var proc = require('child_process');

var run = function(good,bad) {
    var scope = this;
    var params = {
        command: process.cwd()+'/build.sh',
        args: scope.args,
        options: {
            maxBuffer: 1024 * 1024
        }
    };
    proc.execFile(params.command,params.args,params.options,function(err,stdout,stderr) {
        if (err) {
            bad(err);
        } else {
            good(stdout);
        }
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
