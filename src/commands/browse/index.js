"use strict";

/**
 * open a browser with the desired app
 * @param {Container ID} either a one or two digit number representing the N column, or a longer string representing the ID column
 * @returns {nothing} (Launches the user's default browser with the specified app)
 * @example sjc browse 1
 * @example sjc browse ef4a
 */

var d = require('../../docker-toolbox.js'),
    fancy = require('../../fancy.js'),
    spawn = require('child_process').spawn;

//  platform-specifc config
var ubuntu = {
    command: 'xdg-open',
};
var osx = {
    command: 'open'
};
var options = {
    stdio: ['ignore','ignore','ignore'],
    detached: true
};
ubuntu.options = osx.options = options;

var run = function(good,bad) {
    if (!(this.args.length)) {
        bad('you need to pass a number');
    } else if ( /^\D+$/.test(this.args[0]) ) { 
        bad('you passed something, but it was not a number');
    } else {
        var n = parseInt(this.args[0]) - 1;
        d.getRunningServices(function(err,services) {
            var s;
            if (n in services) {
                s = services[n];
                var params = {};
                params.args = [services[n].url];
                switch (process.platform.toLocaleLowerCase()) {
                    case 'darwin':
                    params.command = osx.command;
                    params.options = osx.options;
                    break;
                    case 'linux':
                    default:
                    params.command = ubuntu.command;
                    params.options = ubuntu.options;
                    break;
                }
                var action = spawn(params.command,params.args,params.options);
                good( fancy(s.url,'default') );
            } else {
                bad('That app does not exist');
            }
        });
    }
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
