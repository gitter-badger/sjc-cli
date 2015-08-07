"use strict";

module.exports = function(commandName,args){
	// do some stuff, and then return the function that will be invoked by the parent
	var valid_words = ['bark','ruff','woof'];
	return function(){
		if (!args.length) {
			throw new Error('This command needs at least one argument');
		}
		var barkIt = function(word){
			return word.toUpperCase() + '! ';
		};
		var inValidDogWords = args.filter(function(word){
			return ( valid_words.indexOf(word) === -1);
		});
		if (inValidDogWords.length) {
			var error_message = 'Dogs dont say ' + inValidDogWords.join(' or ');
			throw Error(error_message);
		} else {
			console.log('🐶 says ' + args.map(barkIt) );
		}
	};
};
