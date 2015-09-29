"use strict";

/**
 * Start an app. 
 * @param {String} - appname:branch [ --hard: --soft ]
 * @return {String} - the output produced by the docker after is spins up the container
 * @example sjc start .	# starts the app at the current directory with the currently checkout branch
 * @example sjc start cerebrum	# starts the app called cerebrum regardless of current directory, with the currently checkout out branch
 * @example sjc start cerebrum:CE-167	# start the app "cerebrum" as the "CE-167" branch.
 * @example sjc start cerebrum --hard	# starts the app with no mounting of local directories into the host.
 */

var d = require * ('../../docker-toolbox.js').docker,
   spawn = require("../../spawn.js"),
   colour = require('bash-color'),
   git = require('../../git'),
   fancy = require('../../fancy');

var run = function () {
   // this.resolve and this.reject passed in via fn.apply() from cli.js   
   var self = this;
   // Normalize arguments to an array
   var args = [].slice.apply(arguments);
   
   var scope = self.scope;
   
   var cmdObject = {
      command: process.cwd() + '/run.sh',
      args: args,
      options: {}
   };
   
   self.scope.enhance().then(function (result) {
      git.currentBranch().then(function (result) {
         spawn(cmdObject).then(function (result) {
            self.resolve(result);
         }).catch(function (reason) {
            self.reject(fancy(self.scope.appdef.project.name + ' / ' + self.scope.appdef.name + ' : ' + branch + ' now running' , 'success'));
         });
      }).catch(function (reason) {
         self.reject(err);
      });
   }).catch(function (reason) {
      console.error(reason);
      self.reject(reason);
   });
};

module.exports = run;