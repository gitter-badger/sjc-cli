"use strict";

/**
 * Accepts any number of arguments, but the only valid ones are things dogs say
 * @arg {string} - "bark", "ruff", and/or "woof"
 * @returns {string} - barks back what you sent it
 * @throws {CLIError} - if one or more of the args was not in ["barf","ruff","woof"]
 * @example sjc dogsays woof woof ruff
 * @example sjc dogsays meeow
 */

module.exports = function(commandName,args) {
    return new Promise(function(resolve,reject) {
        var validWords = ['bark','ruff','woof'];
        if (!args.length) {
            reject(Error('This command needs at least one argument'));
        }
        var barkIt = function(word) {
            return word.toUpperCase() + '!';
        };
        var inValidDogWords = args.filter(function(word) {
            return ( validWords.indexOf(word) === -1);
        });
        if (inValidDogWords.length) {
            var errorMessage = 'Dogs dont say ' + inValidDogWords.join(' or ');
            reject(Error(errorMessage));
        } else {
            resolve(['🐶  says'].concat(args.map(barkIt)).join(' '));
        }
    });
};
