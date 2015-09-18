"use strict";

/**
 * Start an app. 
 * @param {String} - appname:branch [ --hard: --soft ]
 * @return {String} - the output produced by the docker after is spins up the container
 * @example sjc start .	# starts the app at the current directory with the currently checkout branch
 * @example sjc start cerebrum	# starts the app called cerebrum regardless of current directory, with the currently checkout out branch
 * @example sjc start cerebrum:CE-167	# start the app "cerebrum" as the "CE-167" branch.
 * @example sjc start cerebrum --hard	# starts the app with no mounting of local directories into the host.
 */

var d = require*('../../docker-toolbox.js').docker;
var child_process = require('child_process');

var params = {
    command: process.cwd() + '/run.sh',
    args: ['--hard'],
    options: {}
};

var run = function(good,bad) {
    child_process.execFile(params.command,params.args,params.options,function(err,stdout,stderr){
        if (err) {
            bad(stderr);
        } else {
            good(stdout);
        }
    });
};

module.exports = function(Command,scope) { 
    return new Command(scope,run);
};
