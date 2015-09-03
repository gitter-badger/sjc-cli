"use strict";

var scope = require('../../scope.js'),
    subcommandName = scope.args.shift() || 'running',
    subcommand = require(__dirname + '/' + subcommandName);

module.exports = function(Command,scope) { return new Command(scope,subcommand); };