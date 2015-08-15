"use strict";

var fs = require('fs'),
    CLIError = require('./error.js'),
    conf = require('./vars.js'),
    commandName = process.argv[2] || "help",
    command  = function() {},   // jscs:disable requireSpacesInFunction, requireSpaceBeforeBlockStatements
    CommandConstructor = require('./Command.js'),
    args = process.argv.slice(3),
    legalCommandNames = [],
    scope = {
        "conf": conf,
        "args": args,
        "commandName": commandName
    };

function good(stuff) {
    //  how do we handle good return data from commands?
    switch (typeof stuff) {
        case 'function':
        stuff();
        break;
        case 'number':
        case 'string':
        case 'object':
        console.log(stuff);
        break;
    }
}

function bad(errorOrString) {
    //  how do we handle error data from commands?
    var error;
    if (typeof errorOrString === 'string') {
        error = new Error(errorOrString);
    } else if ( errorOrString instanceof Error ) {
        error = errorOrString;
    } else {
        error = Error('Badly Invoked Error with type: ' + typeof errorOrString);
        console.error(errorOrString);
    }
    throw new CLIError(error);
}

function main() {
    command(CommandConstructor,scope).then(good).catch(bad);
}

fs.readdir( __dirname + '/commands',function(err,files){
    if (err) {
        throw new CLIError(err);
    }
    legalCommandNames = files.map(function(fylename){
        return fylename.replace(/\.js$/,'');
    });
    if (legalCommandNames.indexOf(commandName) > -1) {
        command = require('./commands/' + commandName);
    } else {
        throw new CLIError('command  ' + commandName + ' does not exist');
    }
    main();
});