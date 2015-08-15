"use strict";

/**
 * An example of a pipe-able command. It takes lines of input as unix pipes, and returns those same lines rot13 encoded
 * @param {String} - a line of text, piped as a unix pipe
 * @return {String} - that same line, rot13 encoded
 * @example cat /etc/passwd | sjc rot13
 */

var rot = require('rot'), fancy = require('../../fancy');

module.exports = function(commandName,args) {
    return new Promise(function(resolve,reject) {
        switch (process.stdin.isTTY) {
            case true:
                //  interactive shell
                if (args.length) {
                    resolve(rot(args[0]));
                } else {
                    reject(Error('You didnt send enough arguments'));
                }
            break;
            default:
                //  content is piped
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                process.stdin.on('data', function(data) {
                    process.stdout.write( rot(data) );
                });
                process.stdin.on('end', function(data) {
                    //resolve( fancy('all done!','success') );
                    resolve();
                });
            break;
        }
    });
};
