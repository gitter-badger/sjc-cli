"use strict"

var fs = require('fs'),
   CLIError = require('./error.js'),
   scope = require('./scope.js'),
   commandName = process.argv[2] || "help",
   command = function () { },   // jscs:disable requireSpacesInFunction, requireSpaceBeforeBlockStatements
   args = process.argv.slice(3),
   legalCommandNames = [];

// Promise resolution handler
function good(stuff) {
   switch (typeof stuff) {
      case 'function':
         stuff();
         break;
      case 'number':
      case 'string':
      case 'object':
         console.log(stuff);
         break;
      default:
   }
}

// Promise rejection handler
function bad(errorOrString) {
   var error;
   if (typeof errorOrString === 'string') {
      error = new Error(errorOrString);
   } 
   else if (errorOrString instanceof Error) {
      error = errorOrString;
   }
   else {
      error = Error('Badly Invoked Error with type: ' + typeof errorOrString);
      console.error(errorOrString);
   }
   throw new CLIError(error);
}

// Iterate commands folder and build a list of valid commands
fs.readdir(__dirname + '/commands', function (err, files) {
   if (err) {
      throw new CLIError(err);
   }
   
   // legalCommandNames are JavaScript filenames with the .js extension removed
   legalCommandNames = files.map(function (fylename) {
      return fylename.replace(/\.js$/, '');
   });
   
   if (legalCommandNames.indexOf(commandName) > -1) {
      // If the passed command exists then require its code
      command = require('./commands/' + commandName);
      
      // The command should expose a run() interface as its default to which we will apply handlers and scope as 'this' plus any additional arguments passed into cli.js
      var handlersAndScope = {
         "resolve": good,
         "reject": bad,
         "scope": scope
      }
      command.apply(handlersAndScope, args);
   } 
   else {
      // Command does not exist. Bad command. 
      // To-do: Consider calling help?
      bad('command  ' + commandName + ' does not exist');
   }
});