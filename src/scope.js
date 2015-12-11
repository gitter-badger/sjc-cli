"use strict";

var fs = require('fs');
var commandName = process.argv[2] || "help";
var args = process.argv.slice(3);
var conf = require('./config.json');
var git = require('./git.js');
var childProcess = require('child_process');

var dockerMachine = function(scope,cb) {
    // gets the docker-machine representing the local machine
    var dname, tld, localmachine, err=null;
    if ("docker" in scope && "machine" in scope.docker) {
        cb(err,scope.docker.machine);
    } else if ("docker" in conf && "machine" in conf.docker) {
        dname = Object.keys( conf.docker.machine )[0];
        tld = conf.docker.machine[dname].tld;
        localmachine = {
            "name": dname,
            "tld": tld
        };
        if (!("docker" in scope)) {
            scope.docker = {};
        }
        scope.docker.machine = localmachine;
        cb(err,localmachine);
    } else {
        //  get the current active docker-machine
        //  or else the first listed one
        var commandargs = 'docker-machine active 2> /dev/null || docker-machine ls -q | head -n 1'.split(' ');
        var proc = childProcess.spawn( commandargs.shift() , commandargs);
        var r = '';
        proc.stdout.setEncoding('utf8');
        proc.stderr.setEncoding('utf8');
        proc.stdout.on('data',function(data) {
            if (data) {
                if (r) {
                    r = r + data;
                } else {
                    r = data;
                }
            }
        });
        proc.stderr.on('data',function(data) {
            err = data;
        });
        proc.on('close',function(exitCode) {
            if (exitCode !== 0) {
                err = Error('exit code ' + exitCode);
            } else if (r.trim()) {
                r = r.trim();
            }
            dname = r;
            tld = 'dev';
            localmachine = {
                "name": dname,
                "tld": tld
            };
            if (!("docker" in scope)) {
                scope.docker = {};
            }
            scope.docker.machine = localmachine;
            cb(err,scope.docker.machine);
        });
    }
};

var scope = {
    commandName: commandName,
    args: args,
    conf: conf,
    appdef: null,
    repo: null,
    dockerMachine: dockerMachine.bind(null,this),
    enhance: function(cb) {
        dockerMachine(scope,function(err,localmachine){
            if (err) {
                //  don't fail, keep on enhancing scope
            }
            if (!("docker" in scope)) {
                scope.docker = {};
            }
            scope.docker.machine = localmachine;
            git.currentBranch(function(err,branch) {
                if (err) {
                    cb(err,branch);
                } else {
                    scope.repo = {
                        branch: branch
                    };
                    git.currentRev(function(err,rev) {
                        if (err) {
                            cb(err,rev);
                        } else {
                            scope.repo.rev = rev;
                            fs.readFile(process.cwd()+'/appdef.json',{encoding: "utf8"},function(err,appdefAsString) {
                                if (err) {
                                  cb(Error('There is no appdef file'),appdefAsString);
                                } else {
                                    try {
                                        scope.appdef = JSON.parse(appdefAsString);
                                    } catch(e) {
                                        err = e;
                                    }
                                    cb(err,scope);
                                }
                            });                    
                        }
                    });
                }
            });
        });
    }
};

module.exports = scope;
