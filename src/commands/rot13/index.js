"use strict";

/**
 * An example of a pipe-able command. It takes lines of input as unix pipes, and returns those
 * @param {String} - a line of text, piped as a unix pipe
 * @return {String} - that same line, rot13 encoded
 * @example cat /etc/passwd | sjc rot13
 */

var rot = require('rot'),
	fancy = require('../../fancy')

module.exports = function(commandName,args){
	return new Promise(function(resolve,reject){
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', function(data) {
			process.stdout.write( rot(data) );
		});	
		process.stdin.on('end', function(data) {
			resolve( fancy('all done!','success') );
		});
	});
};
