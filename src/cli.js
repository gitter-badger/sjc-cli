"use strict";

var commandName = process.argv[2] || "help";

var colours = require('colors/safe');

try {
	var command = require('./commands/'+commandName+'/index.js')(commandName,process.argv.slice(3));
	command();
} catch(e) {
	console.error( '❌  ' + colours.red(e) );
}