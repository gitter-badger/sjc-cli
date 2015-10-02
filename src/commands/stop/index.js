"use strict";

/**
 * Currently stops a container, but it should actually stop an *app*.
 * @todo  This should actually stop an app and not a container (ie: all the containers associate to a speicific app)
 * @example sjc stop 1
 * @example sjc stop e4f2
 */


var d = require('../../docker-toolbox.js');
var fancy = require('../../fancy');
var restClient = require('../../restClient.js');


var run = function () {
    // this.resolve and this.reject passed in via fn.apply() from cli.js   
    var self = this;
    // Normalize arguments to an array
    var args = [].slice.apply(arguments);
    
    d.getContainer(args[0], function (err, container) {
        if (err) {
            self.reject(err);
        } else {
            if (container === null) {
                self.reject(Error('The container could not be found'));
            } else {
                d.docker.getContainer(container.id).stop(function (err, data) {
                    if (err) {
                        self.reject(err);
                    } else {
                        self.resolve(fancy('The container was stopped', 'success'));
                    }
                });
            }
        }
    });
};

module.exports = run;