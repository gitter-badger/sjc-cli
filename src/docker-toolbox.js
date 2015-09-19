"use strict";

var conf = require('./config.json');

var Docker = require('dockerode'),
    fs = require('fs'),
    childProcess = require('child_process'),
    fancy = require('./fancy'),
    git = require('./git.js'),
    localMachine = {
        host: process.env.DOCKER_HOST.replace(/:\d+$/,'').replace(/^\D+/,'') || '192.168.99.100',
        port: process.env.DOCKER_HOST.replace(/^.*:/,'') || 2376,
        ca: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/ca.pem', {encoding: "utf8"}),
        cert: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/cert.pem', {encoding: "utf8"}),
        key: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/key.pem', {encoding: "utf8"})
    };

const machineName = conf.machineName;

var d = new Docker({
    host: localMachine.host,
    port: localMachine.port,
    ca: localMachine.ca,
    cert: localMachine.cert,
    key: localMachine.key
});

var machineExec = function(args,cb) {
    var err=null, r=null;
    args.push(machineName);
    var proc = childProcess.spawn('docker-machine',args);
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
            err = 'exit code ' + exitCode;
        } else if (r) {
            r = fancy(r);
        }
        cb(err,r);
    });
};

var allServices = function(transformer,cb) {
    git.currentBranch(function(err, currentBranch) {
        if (err) cb(err,null);
        d.listContainers(function(err,allContainers) {
            var err = err;
            var data = null;
            var cols = [];
            var f = function(x) {
                var r;
                switch (typeof x) {
                    case 'string':
                    r = x.trim();
                    default:
                    r =x;
                }
                return r;
            };
            if (!err) {
                var goodContainers = allContainers.filter(function(container) {
                    var exists = false, isOrchestra = false;
                    exists = ("Labels" in container && "io.sjc.orchestra.version" in container.Labels);
                    if (exists) {
                        //isOrchestra = /v/i.test(container.Labels['io.sjc.orchestra.version']);
                        isOrchestra = true;
                    }
                    return exists && isOrchestra;
                });
                if (goodContainers.length) {
                    cols = goodContainers.map(function(container,n) {
                        var url = null;
                        var port = null;
                        var isAmbassador = container.Labels['io.sjc.orchestra.service.ambassador'];
                        var isSelected = (container.Labels['io.sjc.orchestra.ref'].trim() == currentBranch.trim());
                        if (isAmbassador && container.Ports.length && container.Ports[0].PublicPort) {
                            port = container.Ports[0].PublicPort;
                            url = 'http://' + localMachine.host + ':' + port;
                        }
                        return {
                            id: container.Id,
                            created: container.Created,
                            project: f(container.Labels['io.sjc.orchestra.project']),
                            app: f(container.Labels['io.sjc.orchestra.app.name']),
                            branch: f(container.Labels['io.sjc.orchestra.ref']),
                            selected: isSelected,
                            service: f(container.Labels['io.sjc.orchestra.service.name']),
                            port: f(port),
                            ambassador: f(isAmbassador),
                            mounted: f(container.Labels['io.sjc.orchestra.service.volumeMounted']),
                            url: url,
                            status: f(container.Status)
                        };
                    });
                }
                data = cols;
                data.sort(function(a,b) {
                    var r = 1;
		    if (a.created < b.created) {
                        r = r * -1;
                    }
                    return r;
                });
                if (typeof transformer === 'function') {
                    data = transformer(data);
                }
            }
    	    /*
    	    if (data === null) {
    		err = Error('There was no data returned');
    	    }
    	    */
            cb(err,data);
        });
    });    
};

var D = {
    'docker': d,
    'compose': {},
    'machine': {
        getStatus: function(cb) {
            machineExec(['status'],cb);            
        },
        start: function(cb) {
            machineExec(['start'],cb);
        }
    },
    getContainer: function(token,cb) {
        var transformer = function(allcontainers) {
	    var container = null, n;
            switch (token.length) {
                case 1:
                case 2:
		n = Number(token) + 1;
		if (n in allcontainers) {
		    container = allcontainers[ n ];
                }
                break;
                default:
                container = allcontainers.filter(function(c){
                    var pattern = new RegExp('^'+token,'i');
                    return (pattern.test(c.id));
                }).pop();
                break;
            }
            return container || null;
        };
        allServices(transformer,cb);
    },
    getRunningApps: function(cb) {
        var f = function(allservices) {
            var apps = {};
            allservices.forEach(function(s){
                if (! (s.app in apps) ) {
                    apps[s.app] = [];
                }
                apps[s.app].push(s);
            });
            return apps;
        };
        allServices(f,cb);
    },
    getRunningServices: function(cb) {
        allServices(null,function(err,data) {
            cb(err,data);
        });
    }
};

module.exports = D;