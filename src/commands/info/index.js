"use strict";

var git = require('../../git.js');
var d = require('../../docker-toolbox.js');

var run = function(good,bad) {
    var scope = this;
    var runningContainer = {};
    git.currentBranch(function(err,branch) {
        if (err) {
            bad(err);
        } else {

            /*
            d.getRunningServices(function(err,services){
                if (err) {
                    bad(err);
                } else {
                    runningContainer = services.filter(function(s){

                    });
                }
            });
            */
           

            d.docker.listContainers(function(err,containers) {
                var r = {
                    currentBranch: branch,
                    project: scope.appdef.project.name,
                    appName: scope.appdef.name,
                    services: Object.keys(scope.appdef.services)
                };
                r = containers;
                good(r);                
            });
        }
    });
};

module.exports = function(Command,scope) { 
    return new Command(scope,run);
};
