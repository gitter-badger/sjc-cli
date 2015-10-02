"use strict";

/**
 * Turns on Docker Machine
 * @example: sjc up
 * 
 */

var d = require('../../docker-toolbox.js');

var run = function () {
    var scope = this;
    var args = [].slice.apply(arguments);

    return new Promise(function (resolve, reject) {
        console.log("Note: Cold starting VirtualBox VM on Windows and OSX takes a minute.");
        d.machine.start(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

};

module.exports = run;