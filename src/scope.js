"use strict";

var fs = require('fs');
var commandName = process.argv[2] || "help";
var args = process.argv.slice(3);
var conf = require('./config.json');

var scope = {
    commandName: commandName,
    args: args,
    conf: conf,
    appdef = null;

fs.readFile(process.cwd()+'/appdef.json'),{encoding: "utf8"},function(err,appdefAsString){
    if (err) {
	   //  fail silently
    } else {
	   appdef = JSON.parse(appdefAsString);
    }
});

var scope = {
    commandName: commandName
    args: args
    conf: conf
    appdef: appdef
};

module.exports = scope;
