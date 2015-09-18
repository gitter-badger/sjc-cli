"use strict";

/**
 * Turns on Docker Machine
 * @example: sjc up
 * 
 */

var d = require('../../docker-toolbox.js')

var run = function(good,bad) {
    d.machine.start(function(err,data){
        if (err) {
            bad(err);
        } else {
            good(data);
        }
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
