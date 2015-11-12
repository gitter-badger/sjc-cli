"use strict";

var subcommandName,
    subcommand,
    scope = require('../../scope.js'),
    isFlag = /^\-{1,2}\w+/,
    noSubcommand = function(good,bad) {
        bad(Error('There is no subcommand named ' + subcommandName));
    };

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

    default:
    subcommand = noSubcommand;
    break;
    
}

module.exports = function(Command,scope) { return new Command(scope,subcommand); };
