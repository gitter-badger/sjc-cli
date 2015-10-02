"use strict";

/**
 * Turns on Docker Machine. Defaults to first available machine in appdef.json if machine is not supplied
 * @example 1: sjc up 
 * @example 2: sjc up dev 
 * 
 */

var d = require('../../docker-toolbox.js');

var run = function () {
    return new Promise(function (resolve, reject) {
        d.machine.start(function (err, data) {
            if (err) {
                reject(err);
            } 
            else {
                resolve(data);
            }
        });
    });
};

module.exports = run;