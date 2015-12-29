  "use strict";

/**
 * Do the docker build. Currently this expects and exectutes build.sh in the app's root folder. 
 * @returns {String} whatever the docker build command said
 * @example sjc build
 */

var proc = require('child_process');
var git = require('../../git.js');
var colors = require('colors/safe');
var fancy = require('../../fancy.js');

var run = function(good,bad) {
    var scope = this;
    scope.enhance(function() {
        var serviceNames = Object.keys(scope.appdef.services);
        var globalExitCode;
        var finalMsg;
        var goAhead = function(){
            var serviceName, params;
            if (serviceNames.length) {
                serviceName = serviceNames.shift();
                params = {
                    command: "docker",
                    args: ['build', '-t', "sean9999/"+[scope.appdef.project.slug,scope.appdef.slug,serviceName].join('-')+':'+scope.repo.branch, process.cwd()+'/services/'+serviceName],
                    options: {}
                };
                var p = proc.spawn(params.command,params.args,params.options);
                p.stdout.setEncoding('utf8');
                p.stderr.setEncoding('utf8');
                process.stdout.write( "\n" + [scope.appdef.project.name,scope.appdef.name,scope.repo.branch,serviceName].join(' ☞ ') + "\n" );
                p.stdout.on('data', function(data){
                    process.stdout.write( colors.green(data) );
                });
                p.stderr.on('data', function (data) {
                    process.stderr.write( colors.red(data) );
                });
                p.on('close', function(exitCode){
                    globalExitCode = exitCode;
                    goAhead();
                });
            } else {
                if (globalExitCode === 0) {
                    finalMsg = 'Orchestra app ' + scope.appdef.project.name + '.' + scope.appdef.name + ' was built successfully'; 
                    good(fancy(finalMsg,'success'));
                } else {
                    finalMsg = 'Process exited with code ' + globalExitCode;
                    bad(fancy(finalMsg,'error'));
                }
            }
        };
        goAhead();
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
