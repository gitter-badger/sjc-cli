"use strict";

var fs = require('fs');
var commandName = process.argv[2] || "help";
var args = process.argv.slice(3);
var conf = require('./config.json');

var scope = {
    commandName: commandName,
    args: args,
    conf: conf,
    appdef: JSON.parse(fs.readFileSync( process.cwd() + '/appdef.json',{encoding: "utf8"}))
};

module.exports = scope;
