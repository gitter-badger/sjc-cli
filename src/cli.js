"use strict";

var fs = require('fs'),
	CLIError = require('./error.js'),
	conf = require('./vars.js'),
	commandName = process.argv[2] || "help",
	command  = function() {},	// jscs:disable requireSpacesInFunction, requireSpaceBeforeBlockStatements
	args = process.argv.slice(3),
	legalCommandNames = [];

function good(stuff){
	if (typeof stuff !== 'undefined') {
		console.log(stuff);
	}
}

function bad(errorOrString){
	var error;
	if (typeof errorOrString === 'string') {
		error = new Error(errorOrString);
	} else if ( errorOrString instanceof Error ) {
		error = errorOrString;
	} else {
		error = Error('Badly Invoked Error with type: ' + typeof errorOrString);
		console.error(errorOrString);
	}
	throw new CLIError(error);
}

function main(){
	command(commandName,args,conf).then(good).catch(bad);
}

fs.readdir( __dirname + '/commands',function(err,files){
	if (err) {
		throw new CLIError(err);
	}
	legalCommandNames = files.map(function(fylename){
		return fylename.replace(/\.js$/,'');
	});
	if (legalCommandNames.indexOf(commandName) > -1) {
		command = require('./commands/' + commandName);
	} else {
		throw new CLIError('command  ' + commandName + ' does not exist');
	}
	main();
});