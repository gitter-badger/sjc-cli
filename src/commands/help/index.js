"use strict";

/**
 * Should return a complete list of commands and options, and some basic info on how to use the app
 * @param [String] commmandName - The command you want help on.
 * If no param is sent, it just outputs general help
 */

module.exports = function(commandName,args){
	// do some stuff, and then return the function that will be invoked directly by the parent
	return function(){
		console.log('The remaining args available to ' + commandName + ' are',args);
	};
};
