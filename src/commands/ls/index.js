"use strict";

var Command = require('../../Command'),
	scope = require('../../scope'),
    subcommandName = scope.args.shift() || 'running',
    subcommand = require(__dirname + '/' + subcommandName);

module.exports = function(scope) { return new Command(scope,subcommand) };