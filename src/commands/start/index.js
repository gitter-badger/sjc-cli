"use strict";

var Command = require('../../Command.js'),
    subcommand = require(__dirname + '/' + subcommandName);

var run = function(good,bad) {
    var malleability = 'soft';    
    if ("--hard" in this.args) {
        malleability = 'hard';
    }
};

module.exports = function(scope) { 
    return new Command(scope,run);
};
