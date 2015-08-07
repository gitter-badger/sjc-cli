"use strict";

module.exports = function (args) {
	// do some stuff, and then return the function that will be invoked by the parent
	return function () {
		console.log('go Team!');
		console.log(args);
	};
};