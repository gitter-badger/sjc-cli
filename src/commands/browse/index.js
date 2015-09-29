"use strict";

/**
 * open a browser with the desired app
 * @param {Container ID} either a one or two digit number representing the N column, or a longer string representing the ID column
 * @returns {nothing} (Launches the user's default browser with the specified app)
 * @example sjc browse 1
 * @example sjc browse ef4a
 */

var d = require('../../docker-toolbox.js'),
   fancy = require('../../fancy.js'),
   spawn = require("../../spawn.js");

//  platform-specifc config
var ubuntu = {
   command: 'xdg-open',
};
var osx = {
   command: 'open'
};
var options = {
   stdio: ['ignore', 'ignore', 'ignore'],
   detached: true
};
var params = {};
ubuntu.options = osx.options = options;
switch (process.platform.toLocaleLowerCase()) {
   case 'darwin':
      params.command = osx.command;
      params.options = osx.options;
      break;
   case 'linux':
   default:
      params.command = ubuntu.command;
      params.options = ubuntu.options;
      break;
}

var run = function () {
   // this.resolve, this.reject and this.scope passed in via fn.apply() from cli.js
   var self = this;
   // Normalize arguments to an array   
   var args = [].slice.apply(arguments);
   
   return new Promise(function (resolve, reject) {
      var action;
      if (!(args.length)) {
         self.reject('you need to pass container index or partial id');
      } 
      else {
         d.getContainer(args[0], function (err, container) {
            if (err) {
               self.reject(err);
            } 
            else {
               params.args = [container.url];
               
               var cmdObject = {
                  command: params.command,
                  args: params.args,
                  options: params.options
               };
               
               spawn(cmdObject).then(function (results) {
                  self.resolve(fancy(container.url, 'default'));
               }).catch(function (reason) {
                  self.reject(reason);
               });

            }
         });
      }
   });
}

module.exports = run;
