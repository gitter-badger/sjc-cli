"use strict";

var docker = require('../../docker-toolbox.js').docker;


var run = function(good,bad){
    docker.listContainers(function(err,allContainers){
        if (err) {
            bad(err);
        } else {
            var goodContainers = allContainers.filter(function(container) {
                var exists = false, isOrchestra = false;
                exists = ("Labels" in container && "io.sjc.orchestra.version" in container.Labels);
                if (exists) {
                    isOrchestra = /v/i.test(container.Labels['io.sjc.orchestra.version']);
                }
                return exists && isOrchestra;
            });
            good(goodContainers);
        }
    });
};

module.exports = run;
