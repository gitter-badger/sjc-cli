  "use strict";

/**
 * Do the docker build. Currently this expects and exectutes build.sh in the app's root folder. 
 * @returns {String} whatever the docker build command said
 * @example sjc build
 */

var proc = require('child_process');
var git = require('../../git.js');

var run = function(good,bad) {
    var scope = this;
    var output = 'Beginning container build work...' + "\n\n";
    scope.enhance(function() {
        var serviceNames = Object.keys(scope.appdef.services);
        var goAhead = function(){
            var serviceName, params;
            if (serviceNames.length) {
                serviceName = serviceNames.shift();
                output += "\n" + "Bulding " + serviceName + "...\n";
                params = {
                    command: "docker build -t sean9999/" + [scope.appdef.project.slug,scope.appdef.slug,serviceName].join('-') + ':' + scope.repo.branch + ' ' + process.cwd() + '/services/' + serviceName,
                    options: {
                        maxBuffer: 1024 * 1024,
                        shell: '/bin/bash'
                    }
                };
                proc.exec(params.command, params.options, function(err,stdout,stderr){
                    if (err) {
                        console.trace(err);
                        bad(stderr);
                    } else {
                        output += stdout;
                        goAhead();
                    }
                });
            } else {
                good(output);
            }
        };
        goAhead();
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
