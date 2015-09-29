"use strict";

/**
 * An example command, to get you going
 * @arg {Command} Command - The command constructor function, which cli.js passed in
 * @arg {Object} scope - an object containing args, commandName, and conf (commandline arguments, configuration settings, and the current command's name)
 * @returns (Function) - new Command
 * @example: sjc example hello world
 * @example: sjc throw
 */

var run = function () {
   // this.resolve, this.reject and this.scope passed in via fn.apply() from cli.js
   var self = this;
   // Normalize arguments to an array   
   var args = [].slice.apply(arguments);
   
   /**
     * this performs our main logic. when we passed `scope` in, it attached to `this`
     * good is a callback function for when things turned out ok
     * bad is it's evil twin
     */

   var scope = self.scope;
   
   if (args[0] === 'throw') {
      self.reject('i am throwing an error');
   } 
   else {
      //  let's show the user everything in run's scope, which we bound to "this"
      self.resolve(scope);
   }
};


module.exports = run;