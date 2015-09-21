"use strict";

var hosts = require('../../superHostile.js');

var run = function(good,bad) {
    hosts.list(function(err,data) {
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