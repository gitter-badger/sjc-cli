"use strict"
var cli = function () { }

var fs = require('fs'),
    CLIError = require('./error.js'),
    path = require("path"),
    scope = require('./scope.js'),
    commandName = process.argv[2] || "help",
    command = function () { },   // jscs:disable requireSpacesInFunction, requireSpaceBeforeBlockStatements
    args = process.argv.slice(3),
    spawn = require("./spawn.js");
//legalCommandNames = [];

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
        fs.readdir(__dirname + '/commands', function (err, files) {
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


cli.run = function (commandName, args, scope) {
    return new Promise(function (resolve, reject) {
        getLegalCommandNames().then(function (legalCommandNames) {
            if (legalCommandNames.indexOf(commandName) > -1) {
                command = require('./commands/' + commandName);
                command.apply(scope, args).then(function (result) {
                    resolve(result);
                }).catch(function (reason) {
                    reject(reason);
                });
            } 
            else {
                // It is not built-in command so assume it is a properly written external command and attempt to spawn it
                var spawnOptions = {};
                spawn(commandName, args, spawnOptions).then(function (result) {
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
    return cli.run(commandName, args, scope).then(function (result) {
        good(result);
    }).catch(function (reason) {
        bad(reason);
    });
}

module.exports = cli;