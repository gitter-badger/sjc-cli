"use strict";

var Command = require('../../Command.js'),
    subcommandName = scope.args.shift() || 'ls',
    subcommand = require(__dirname + '/' + subcommandName);

module.exports = function(scope) { return new Command(scope,subcommand) };