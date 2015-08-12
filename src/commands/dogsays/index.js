"use strict";

/**
 * Accepts any number of arguments, but the only valid ones are things dogs say
 * @arg {string} - "bark", "ruff", and/or "woof"
 * @returns {string} - barks back what you sent it
 * @throws {CLIError} - if one or more of the args was not in ["barf","ruff","woof"]
 * @example sjc dogsays woof woof ruff
 * @example sjc dogsays meeow
 */

module.exports = function(commandName,args){
	return new Promise(function(resolve,reject){
		var valid_words = ['bark','ruff','woof'];
		if (!args.length) {
			reject(Error('This command needs at least one argument'));
		}
		var barkIt = function(word){
			return word.toUpperCase() + '! ';
		};
		var inValidDogWords = args.filter(function(word){
			return ( valid_words.indexOf(word) === -1);
		});
		if (inValidDogWords.length) {
			var error_message = 'Dogs dont say ' + inValidDogWords.join(' or ');
			reject(Error(error_message));
		} else {
			resolve('🐶  says ' + args.map(barkIt));
		}		
	});
};
