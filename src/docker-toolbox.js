"use strict";
var Docker = require('dockerode'),
   fs = require('fs'),
   childProcess = require('child_process'),
   fancy = require('./fancy'),
   git = require('./git.js'),
   scope = require('./scope'),
   localMachine = {},
   d;

if (process.platform.toLowerCase() === 'darwin') {
   localMachine = {
      host: process.env.DOCKER_HOST.replace(/:\d+$/, '').replace(/^\D+/, '') || '192.168.99.100',
      port: process.env.DOCKER_HOST.replace(/^.*:/, '') || 2376,
      ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem', { encoding: "utf8" }),
      cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem', { encoding: "utf8" }),
      key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem', { encoding: "utf8" })
   };
   d = new Docker(localMachine);
} else {
   localMachine = {
      host: '127.0.0.1'
   };
   d = new Docker();
}

var allServices = function(transformer,cb) {
   scope.dockerMachine(function(err,localDockerMachine) {
      if (err) cb(err,null);
      git.currentBranch(function(err, currentBranch) {
         if (err) {
            //  no need to fail here. we are simply not in a a git repo
            currentBranch = '';
         }
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
                        isOrchestra = true;
                     }
                     return exists && isOrchestra;
               });
               if (goodContainers.length) {
                  cols = goodContainers.map(function(container,n) {
                     var appService;
                     var url = null;
                     var port = null;
                     var isAmbassador = container.Labels['io.sjc.orchestra.service.ambassador'];
                     var isSelected = (container.Labels['io.sjc.orchestra.ref'].trim() == currentBranch.trim());
                     var projectSlug = container.Labels['io.sjc.orchestra.project.slug'] || container.Labels['io.sjc.orchestra.project'];
                     appService = {
                        id: container.Id,
                        created: container.Created,
                        project: f(projectSlug),
                        app: f(container.Labels['io.sjc.orchestra.app.slug']),
                        branch: f(container.Labels['io.sjc.orchestra.ref']),
                        selected: isSelected,
                        service: f(container.Labels['io.sjc.orchestra.service.name']),
                        port: f(port),
                        ambassador: f(isAmbassador),
                        mounted: f(container.Labels['io.sjc.orchestra.service.volumeMounted']),
                        url: url,
                        status: f(container.Status)
                     };
                     if (isAmbassador && container.Ports.length && container.Ports[0].PublicPort) {
                        port = container.Ports[0].PublicPort;
                        url = 'http://' + [appService.project, appService.app, appService.branch,appService.service, localDockerMachine.tld].join(".");
                     }
                     appService.port = port;
                     appService.url = url;
                     return appService;
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
               if (!data) {
                  err = Error('There are no services running that match that criteria');
               }
            }
            cb(err, data);
         });
      });
   });
};

var machineExec = function (args, cb) {
   var err = null, r = null;
   scope.dockerMachine(function(err,localMachine){
      if (err) {
         cb(err,r);
      } else {
         args.push(localMachine.name);
         if (process.platform.toLowerCase() === 'linux') {
            // Linux
            r = 'docker-machine does not exist on linux. you are good to go.';
            cb(err, r);
         } 
         else if (process.platform.toLowerCase() === "win32") {
            // Windows - Since we don't need to reference docker-machine later we can simply exec on Windows      
            var exec = require("child_process").exec;
            var command = ["docker-machine"].concat(args).join(" ");
            exec(command, function (err, stdout, stderr) {
               if (err) {
                  cb(err);
               }
               else { 
                  cb(null, stdout);
               }
            });
         } else {
            // OSX
            var proc = childProcess.spawn('docker-machine', args);
            proc.stdout.setEncoding('utf8');
            proc.stderr.setEncoding('utf8');
            proc.on('unhandledRejection', function (reason, p) {
               console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
            });
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
               } else if (r) {
                   r = r.trim();
                   cb(err,r);
               }
            });
         }
      };
   });
};

var D = {
   'docker': d,
   'compose': {},
   'machine': {
      getStatus: function (cb) {
         machineExec(['status'], cb);
      },
      start: function (cb) {
         machineExec(['status'],function(err,status){
            if (status === 'Running') {
               cb(null,status);
            } else {
               machineExec(['start'], cb);      
            }
         });
      },
      stop: function (cb) {
         machineExec(['stop'], cb);
      },
      ip: function(cb) {
        machineExec(['ip'], cb); 
      },
      getEnv: function(cb) {
         scope.dockerMachine(function(err,localMachine) {
            if (err) {
               cb(err,null);
            } else if ("env" in localMachine) {
               cb(null,localMachine.env);
            } else {
               childProcess.exec('docker-machine env '+localMachine.name,function(error, stdout, stderr) {
                  if (error) {
                     cb(error,null);
                  } else {
                     var env = {};
                     stdout.split('\n').filter(function(row){
                         return ( /^\s*export\s/.test(row) );
                     }).forEach(function(row){
                         var tokens = row.replace('export ','').trim().split('=');
                         var k = tokens[0];
                         var v = tokens[1].replace(/^"|"$/g,'');
                         env[k]=v;
                     });
                     env.PATH = process.env.PATH;
                     env.USER = process.env.USER;
                     localMachine.env = env;
                     cb(null,env);
                  }
               });
            }
         });
      }
   },
   getContainer: function (token, cb) {
      //  get a container by id or number
      var transformer = function (allcontainers) {
         var container = null, n;
         switch (token.length) {
            case 1:
            case 2:
               n = Number(token) - 1;
               if (n in allcontainers) {
                  container = allcontainers[ n ];
               }
               break;
            default:
               container = allcontainers.filter(function (c) {
                  var pattern = new RegExp('^' + token, 'i');
                  return (pattern.test(c.id));
               }).pop();
               break;
         }
         return container;
      };
      allServices(transformer, cb);
   },
   getRunningApps: function (cb) {
      var f = function (allservices) {
         var apps = {};
         allservices.forEach(function (s) {
            if (!(s.app in apps)) {
               apps[s.app] = [];
            }
            apps[s.app].push(s);
         });
         return apps;
      };
      allServices(f, cb);
   },
   searchContainer: function(transformer,cb) {
        allServices(transformer,cb);
    },   
   getRunningServices: function (cb) {
      allServices(null, function (err, data) {
         cb(err, data);
      });
   }
};

module.exports = D;
