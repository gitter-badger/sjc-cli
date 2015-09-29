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
   repo: null,

   enhance: function () {
      return new Promise(function (resolve, reject) {
         git.currentBranch().then(function (result) {
            scope.repo = {
               branch: result
            };
            git.currentRev().then(function (result) {
               scope.repo.rev = result;
               fs.readFile(process.cwd() + '/appdef.json', { encoding: "utf8" }, function (err, appdefAsString) {
                  if (err) {
                     reject('There is no appdef file');
                  } 
                  else {
                     try {
                        scope.appdef = JSON.parse(appdefAsString);
                     } 
                     catch (e) {
                        err = e;
                     }
                     resolve(scope);
                  }
               });
            }).catch(function (reason) {
               // git.currentRev() failed
               reject(reason);
            });
         }).catch(function (reason) {
            // git.currentBranch() failed
            reject(reason);
         });
      });
   }
}

module.exports = scope;