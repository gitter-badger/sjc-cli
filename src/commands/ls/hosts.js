"use strict";

/**
 * List all items in /etc/hosts that pertain to us
 */

var restClient = require('../../restClient.js');

var run = function(good,bad) {
    restClient.get(function(err,ambassadors){
        if (err) {
            bad(err);
        } else {
            good(ambassadors);
        }
    });
};

module.exports = run;