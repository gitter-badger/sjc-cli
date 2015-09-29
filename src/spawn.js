/*
 * Use as a common method of spawning child processes when wrapping external commands
 * 
 * Returns a promise upon completion but hooks stdio of parent process
 * 
 */
"use strict"

var spawn = require("child_process").spawn;

module.exports = function (cmdObj) {
   return new Promise(function (resolve, reject) {
      var proc = spawn(cmdObj.command, cmdObj.args, cmdObj.options);
      
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
            resolve();
         }
         else {
            reject(code);
         }
      });
   });
}