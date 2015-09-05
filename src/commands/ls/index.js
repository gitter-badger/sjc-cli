"use strict";

<<<<<<< HEAD
var Command = require('../../Command'),
	scope = require('../../scope'),
=======
var scope = require('../../scope.js'),
>>>>>>> 78b0398ba3e4e66704969956305b14611f57805c
    subcommandName = scope.args.shift() || 'running',
    subcommand = require(__dirname + '/' + subcommandName);

module.exports = function(Command,scope) { return new Command(scope,subcommand); };