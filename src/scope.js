"use strict";

var commandName = process.argv[2] || "help";
var args = process.argv.slice(3);
var conf = require('./vars.js');

var scope = {
    commandName: commandName,
    args: args,
    conf: conf
};

module.exports = scope;