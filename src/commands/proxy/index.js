"use strict";

var subcommandName,
    subcommand,
    scope = require('../../scope.js'),
    isFlag = /^\-{1,2}\w+/,
    noSubcommand = function(good,bad) {
        bad(Error('There is no subcommand named ' + subcommandName));
    },
    childProcess = require('child_process');

//  this effectively makes the default command 'sjc proxy status'
if ( isFlag.test(scope.args[0]) || scope.args.length === 0 ) {
    scope.args.unshift('status');
}
subcommandName = scope.args.shift();

switch(subcommandName) {
    
    case 'status':
    subcommand = function(good,bad){
        good('Everything is groovy man');
    };
    break;

    case 'start':
    subcommand = function(good,bad){
        var parameters = {
            file: process.env['HOME'] + '/.sjc/reverseproxy/run.sh',
            args: [],
            options: []
        };
        childProcess.execFile(parameters.file,parameters.args,parameters.options,function(err,stdout,stderr){
            if (err) {
                bad(err);
            } else {
                good('Reverse Proxy now running');
            }
        });
    };
    break;

    default:
    subcommand = noSubcommand;
    break;
    
}

module.exports = function(Command,scope) { return new Command(scope,subcommand); };
