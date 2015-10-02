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
    var scope = this;
    // Normalize arguments to an array   
    var args = [].slice.apply(arguments);
    
    return new Promise(function (resolve, reject) {
        var words = args;
        var inValidDogWords = words.filter(function (word) {
            return (validWords.indexOf(word.toLowerCase()) === -1);
        }).filter(function (word) {
            return (word);
        });
        if (!words.length) {
            reject(Error('This command needs at least one argument'));
        } 
        else if (inValidDogWords.length) {
            reject(Error('Dogs dont say ' + inValidDogWords.join(' or ')));
        } 
        else {
            resolve([dogChar + '  says'].concat(words.map(barkIt)).join(' '));
        }
    });
};

module.exports = run;