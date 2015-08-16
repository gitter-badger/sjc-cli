"use strict";

var Command = require('../../Command.js'),
    git = require('../../git.js'),
    subcommandName = process.argv[3] || 'ls',
    subcommand = require(__dirname + '/' + subcommandName);

module.exports = function(scope) {
    return new Command(scope,subcommand);
};