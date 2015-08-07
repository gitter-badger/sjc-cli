"use strict";

var commandName = process.argv[2] || "help";

var command = require('./commands/'+commandName+'/index.js')(commandName,process.argv.slice(3));

try {
	command();
} catch(e) {
	console.error(e);
}