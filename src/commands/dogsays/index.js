"use strict";

/**
 * Accepts any number of arguments, but the only valid ones are things dogs say
 * @arg {string} - "bark", "ruff", and/or "woof"
 * @returns {string} - barks back what you sent it
 * @throws {CLIError} - if one or more of the args was not in ["barf","ruff","woof"]
 * @example sjc dogsays woof woof ruff
 * @example sjc dogsays meeow
 */

var Command = require('../Command.js');

const dogChar = '🐕';
const validWords = ['bark','ruff','woof'];
var barkIt = function(word) {
    return word.toUpperCase() + '!';
};

module.exports = function(scope){
    var run = function(good,bad) {
        var words = this.args;
        var inValidDogWords = words.filter(function(word) {
            return ( validWords.indexOf(word) === -1);
        }).filter(function(word) {
            return (word);
        });
        if (!words.length) {
            bad(Error('This command needs at least one argument'));
        } else if (inValidDogWords.length) {
            bad(Error('Dogs dont say ' + inValidDogWords.join(' or ')));
        } else {
            good([dogChar + '  says'].concat(words.map(barkIt)).join(' '));
        }
    };
    return new Command(scope,run);
};
