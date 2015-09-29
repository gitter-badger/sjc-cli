"use strict";

/**
 * Do the docker build. Currently this expects and exectutes build.sh in the app's root folder. 
 * @todo Make this not depend on ./build.sh, but rather get all required information from git and appdef
 * @returns {String} whatever the docker build command said
 * @example sjc build
 */

var spawn = require("../../spawn.js");

var run = function () {
   // this.resolve, this.reject and this.scope passed in via fn.apply() from cli.js
   var self = this;
   // Normalize arguments to an array   
   var args = [].slice.apply(arguments);
   
   var cmdObject = {
      command: process.cwd() + "/build.sh",
      args: args,
      options: {}
   };
   
   spawn(cmdObject).then(function (results) {
      self.resolve(results);
   }).catch(function (reason) {
      self.reject(reason);
   });
};

module.exports = run;