"use strict";

var d = require('../../docker'),
    container = d.getContainer('e08831d4b3ba'),
    git = require('../../git');

var run = function(good,bad){
    container.inspect(function (err, containerdata) {
        if (err) {
            bad(err);
        } else {
            git.currentBranch(function(err, branch){
                if (err) {
                    bad(err);
                } else {
                    var r = {
                        ports: JSON.stringify(containerdata.NetworkSettings.Ports),
                        gitBranch: branch.trim()
                    };
                    good(r);
                }
            });
        }
    });
};

module.exports = run;