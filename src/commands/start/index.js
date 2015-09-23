"use strict";

/**
 * Start an app. 
 * @param {String} - appname [ --hard: --soft ]
 * @return {String} - the output produced by the docker after is spins up the container
 * @example sjc start .	# starts the app at the current directory with the currently checkout branch
 * @example sjc start cerebrum	# starts the app called cerebrum regardless of current directory, with the currently checkout out branch
 * @example sjc start cerebrum:CE-167	# start the app "cerebrum" as the "CE-167" branch.
 * @example sjc start cerebrum --hard	# starts the app with no mounting of local directories into the host.
 */

var dockerToolbox = require('../../docker-toolbox.js');
var child_process = require('child_process');
var colour = require('bash-color');
var git = require('../../git');
var fancy = require('../../fancy');
var restClient = require('../../restClient.js');
var d = dockerToolbox.d;

var run = function(good,bad) {
    var scope = this;
    var params = {
        command: process.cwd() + '/run.sh',
        args: this.args,
        options: {}
    };
    scope.enhance(function(err,scope) {
        var ambassador = Object.keys(scope.appdef.services).filter(function(servicename){
            return ( scope.appdef.services[servicename].ambassador === true );
        }).pop();
        var permalink = [scope.appdef.project.slug,scope.appdef.slug,scope.repo.branch,ambassador,scope.conf.localTLD].join('.').trim();
        if (!ambassador) {
            bad(Error('No ambassador specified in appdef. Orchestra doesn\'t know what service to expose'));
        } else {
            dockerToolbox.machine.ip(function(err,machineIp) {
                if (err) {
                    bad(err);
                } else {
                    git.currentBranch(function(err,branch){
                        if (err) {
                            bad(err);
                        } else {
                            child_process.execFile(params.command,params.args,params.options,function(err,stdout,stderr) {
                                if (err) {
                                    bad(err);
                                } else {
                                    //  now get the IP of the ambassador
                                    var thisOne = function(allcontainers){
                                        var r = allcontainers.filter(function(c){
                                            return ( c.project == scope.appdef.project.slug && c.app == scope.appdef.slug && c.branch == scope.repo.branch && c.ambassador );
                                        });
                                        return r;
                                    };
                                    dockerToolbox.searchContainer(thisOne,function(err,ambassador){
                                        if (err) {
                                            bad(err);
                                        } else {
                                            restClient.post(scope.appdef,function(err,data){
                                                if (err) {
                                                    bad(err);
                                                } else {
                                                    good(fancy(scope.appdef.project.name + ' / ' + scope.appdef.name + ' : ' +  branch + ' now running at ' + permalink ,'success'));    
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

module.exports = function(Command,scope) { 
    return new Command(scope,run);
};
