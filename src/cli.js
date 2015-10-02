"use strict"
var cli = function () { }

var fs = require('fs'),
    CLIError = require('./error.js'),
    path = require("path"),
    scope = require('./scope.js'), // Mainly a property bag of data including command, args, settings and current application definition
    command = function () { },   // jscs:disable requireSpacesInFunction, requireSpaceBeforeBlockStatements
    spawn = require("./spawn.js");

    /* To-do 
     * -----
     * Implement a command parser such as https://www.npmjs.com/package/commander
     * Add a command to specify path to appdef with appropriate default behaviour
     * Consider moving scope code inside this module since it is entirely coupled
     * Refactor out scope.args as we are already passing scope in several methods
     * 
     */
    
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


function getLegalCommandNames() {
    return new Promise(function (resolve, reject) {
        fs.readdir(path.join(__dirname, 'commands'), function (err, files) {
            if (err) {
                reject(new CLIError(err));
            }
            
            // legalCommandNames are JavaScript filenames with the .js extension removed
            var legalCommandNames = files.map(function (fylename) {
                return fylename.replace(/\.js$/, '');
            });
            resolve(legalCommandNames);
        });
    });
}


cli.run = function (scope) {
    return new Promise(function (resolve, reject) {
        getLegalCommandNames().then(function (legalCommandNames) {
            if (legalCommandNames.indexOf(scope.commandName) > -1) {
                command = require('./commands/' + scope.commandName);
                command.apply().then(function (result) { 
                    resolve(result);
                }).catch(function (reason) {
                    reject(reason);
                });
            } 
            else {
                // It is not built-in command so assume it is a properly written external command and attempt to spawn it
                var spawnOptions = {};
                spawn(scope.commandName, scope.args, spawnOptions).then(function (result) {
                    resolve(result);
                }).catch(function (reason) {
                    reject(reason);
                });
            }

        }).catch(function (reason) {
            // Problem with getLegalNames
            reject(reason);
        });
    });
}

if (!module.parent) {
    return cli.run(scope).then(function (result) {
        good(result);
    }).catch(function (reason) {
        bad(reason);
    });
}

module.exports = cli;