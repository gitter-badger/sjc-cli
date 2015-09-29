"use strict";

/**
 * Accepts any number of arguments, but the only valid ones are things dogs say
 * @arg {string} - "bark", "ruff", and/or "woof"
 * @returns {string} - barks back what you sent it
 * @throws {CLIError} - if one or more of the args was not in ["barf","ruff","woof"]
 * @example sjc dogsays woof woof ruff
 * @example sjc dogsays meeow
 */

const dogChar = '🐕 ';
const validWords = ['bark', 'ruff', 'woof'];
var barkIt = function (word) {
   return word.toUpperCase() + '!';
};

var run = function () {
   // this.resolve, this.reject and this.scope passed in via fn.apply() from cli.js
   var self = this;
   // Normalize arguments to an array   
   var args = [].slice.apply(arguments);

   var words = args;
   var inValidDogWords = words.filter(function (word) {
      return (validWords.indexOf(word.toLowerCase()) === -1);
   }).filter(function (word) {
      return (word);
   });
   if (!words.length) {
      self.reject(Error('This command needs at least one argument'));
   } else if (inValidDogWords.length) {
      self.reject(Error('Dogs dont say ' + inValidDogWords.join(' or ')));
   } else {
      self.resolve([dogChar + '  says'].concat(words.map(barkIt)).join(' '));
   }
};

module.exports = run;