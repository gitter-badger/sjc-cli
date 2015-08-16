"use strict";

var docker = require('../../docker.js');

var run = function(good,bad){
    docker.listContainers(function(err,allContainers){
        if (err) {
            bad(err);
        } else {
            var goodContainers = allContainers.filter(function(container){
                var r = false;
                if ("Labels" in container && "io.sjc.manager" in container.Labels) {
                    return ( /shelbot/.test(container.Labels['io.sjc.manager']) );
                }
                return r;
            });
            good(goodContainers);
        }
    });    
};

module.exports = run;
