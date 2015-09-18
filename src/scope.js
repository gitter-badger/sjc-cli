"use strict";

var fs = require('fs');
var commandName = process.argv[2] || "help";
var args = process.argv.slice(3);
var conf = require('./config.json');

var scope = {
    commandName: commandName,
    args: args,
    conf: conf,
    appdef: null
};

fs.readFile(process.cwd()+'/appdef.json',{encoding: "utf8"},function(err,appdefAsString) {
    if (err) {
	   //  fail silently
    } else {
	   scope.appdef = JSON.parse(appdefAsString);
    }
});

module.exports = scope;
