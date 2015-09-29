"use strict";

/**
 * reads appdef and returns it. First uses scope's "enhance" method to learn about the current repo and appdef
 * @returns {String} the contents of appdef.json, or an error if the current dir is not a git repo, or does not have an appdef file
 * @example sjc info (from the root of a repo containing an appdef.json file)
 * @example sjc info (from anywhere else)
 */

module.exports = function () {
   // this.resolve, this.reject and this.scope passed in via fn.apply() from cli.js
   var self = this;
   // Normalize arguments to an array   
   var args = [].slice.apply(arguments);
   
   self.scope.enhance(function (err, newcope) {
      if (err) {
         self.reject(err);
      } else {
         self.resolve(self.scope);
      }
   });
};