"use strict";

/**
 * Spin down docker machine. Takes no arguments. it simply invokes "docker-machine stop default"
 * @returns (stdout) - whatever the docker-machine command said
 */

var d = require('../../docker-toolbox.js');

var run = function () {
    return new Promise(function (resolve, reject) {
        d.machine.stop(function (err, data) {
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