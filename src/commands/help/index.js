"use strict";

module.exports = function(commandName,args){
	// do some stuff, and then return the function that will be invoked by the parent
	return function(){
		console.log('The remaining args available to '+commandName+' are',args);
	};
};
