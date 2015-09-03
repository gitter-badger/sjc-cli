"use strict";

/**
 * DO the docker build
 */

var readYaml = require('read-yaml');

var buildContainer = function(serviceName,service) {
    
};

var run = function(good,bad) {

    var services = [];

    readYaml( process.cwd() + '/appdef.yml' , function(err, data) {
        if (err) {
            bad(err);
        } else {
            for (var serviceName in data.services) {
                
            }
        }
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
