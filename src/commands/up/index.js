"use strict";

/**
 * Turns on Docker Machine and Reverse Proxy
 * @example: sjc up
 * 
 */

var d = require('../../docker-toolbox.js'),
    childProcess = require('child_process'),
    params = {
        command: process.env.HOME + '/.sjc/reverseproxy/run.sh',
        args: {},
        options: {
            cwd: process.env.HOME + '/.sjc/reverseproxy'
        }
    };

var run = function (good, bad) {
    console.log("Note: Cold starting VirtualBox VM takes a minute...");
    var scope = this;
    d.machine.start(function(err,data) {
        if (err) {
            bad(err);
        } else {
            d.machine.getEnv(function(err,env) {
                if (err) {
                    bad(err);
                } else {
                    params.options.env = env;
                    childProcess.execFile(params.command, params.args,params.options, function(err,stdout,stderr) {
                        if (err) {
                            bad(err);
                        } else {
                            good(stdout);
                        }
                    });
                }
            });
        }
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
