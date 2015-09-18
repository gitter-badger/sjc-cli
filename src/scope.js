"use strict";

var fs = require('fs');
var commandName = process.argv[2] || "help";
var args = process.argv.slice(3);
var conf = require('./config.json');
var git = require('./git.js');

var scope = {
    commandName: commandName,
    args: args,
    conf: conf,
    appdef: null,
    repo: {}
};

git.currentBranch(function(err,branch) {
    if (err) {
        //  fail silently
    } else {
        scope.repo.branch = branch
    }
});

git.currentBranch(function(err,rev) {
    if (err) {
        //  fail silently
    } else {
        scope.repo.rev = rev
    }
});

fs.readFile(process.cwd()+'/appdef.json',{encoding: "utf8"},function(err,appdefAsString) {
    if (err) {
	   //  fail silently
    } else {
	   scope.appdef = JSON.parse(appdefAsString);
    }
});

module.exports = scope;
