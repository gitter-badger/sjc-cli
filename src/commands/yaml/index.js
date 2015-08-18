"use strict";

var readYaml = require('read-yaml'),
    Command = require('../../Command.js');

var run = function(good,bad) {
    readYaml( process.cwd() + '/sjc.yml' , function(err, data) {
        if (err) {
            bad(err);
        } else {
            good(data);
        }
    });
};

module.exports = function(scope){
    return new Command(scope,run);
};