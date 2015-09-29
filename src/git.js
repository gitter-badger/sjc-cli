"use strict";

var git = {};
var spawn = require("./spawn.js");

git.currentBranch = function () {
   return new Promise(function (resolve, reject) {
      //   var cmdObject = {
      //      "command":  __dirname+"/commands/start/test.sh",
      //      "args": [], 
      //      "options": {}
      //   }
      //   //"args": ["rev-parse", "--abbrev-ref", "HEAD", "|", "tr", "-d", "'\n'"],
      //   spawn(cmdObject).then(function (result) {
      //      resolve(result);
      //   }).catch(function (reason) {
      //      console.error(reason);
      //      reject(reason);
      //   });
      //});
      var proc = require("child_process");
      proc.exec('git rev-parse --abbrev-ref HEAD | tr -d "\n"', function (error, stdout, stderr) {
         if (!error) { 
            resolve(stdout);
         }
         else { 
            reject(error);
         }
      });
   });
};

git.currentRev = function () {
   return new Promise(function (resolve, reject) {
      var proc = require("child_process");
      proc.exec('git rev-parse HEAD | tr -d "\n"', function (error, stdout, stderr) {
         if (!error) { 
            resolve(stdout);
         }
         else { 
            reject(error);
         }
      });
   });
}

module.exports = git;
