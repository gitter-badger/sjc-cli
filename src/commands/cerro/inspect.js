"use strict";

var docker = require('../../docker.js');
var container = d.getContainer('10e2e55276ab');

var run = function(good,bad){
    container.inspect(function (err, containerdata) {
        if (err) {
            console.error(err);
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