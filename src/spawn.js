/*
 * Use as a common method of spawning child processes when wrapping external commands
 * 
 * Returns a promise upon completion but hooks stdio of parent process
 * 
 */
"use strict"

var spawn = require("child_process").spawn;

module.exports = function (command, args, options) {
    return new Promise(function (resolve, reject) {
        var proc = spawn(command, args, options);
        
        proc.stdout.on("data", function (data) {
            console.log("" + data);
        });
        
        proc.stderr.on("data", function (data) {
            console.error("" + data);
        });
        
        proc.on("error", function (err) {
            reject(err);
        });
        
        proc.on("close", function (code) {
            if (code == 0) {
                resolve(0);
            }
            else {
                reject(code);
            }
        });
    });
}