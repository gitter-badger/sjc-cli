"use strict";

/**
 * An example of a pipe-able command. It takes lines of input as unix pipes, and returns those same lines rot13 encoded
 * @param {String} - a line of text, piped as a unix pipe
 * @return {String} - that same line, rot13 encoded
 * @example cat /etc/passwd | sjc rot13
 */

var rot = require("rot");

var run = function () {
   // this.resolve and this.reject passed in via fn.apply() from cli.js   
   var self = this;
   // Normalize arguments to an array
   var args = [].slice.apply(arguments);
   
   if (args.length) {
      self.resolve(rot(args.join(' ')));
   } else {
      self.reject(Error("You didn't send enough arguments"));
   }
};

module.exports = run;
