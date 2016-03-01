"use strict";

/**
 * Start an app. 
 * @param {String} - appname [ --hard: --soft ]
 * @return {String} - the output produced by the docker after is spins up the container
 * @example sjc start . # starts the app at the current directory with the currently checkout branch
 * @example sjc start cerebrum  # starts the app called cerebrum regardless of current directory, with the currently checkout out branch
 * @example sjc start cerebrum:CE-167   # start the app "cerebrum" as the "CE-167" branch.
 * @example sjc start cerebrum --hard   # starts the app with no mounting of local directories into the host.
 */

var dockerToolbox = require('../../docker-toolbox.js'),
    childProcess = require('child_process'),
    fancy = require('../../fancy'),
    restClient = require('../../restClient.js'),
    d = dockerToolbox.d,
    stream = require('stream');

var appDefToCreateOptions = function(scope,service) {
    service.volumeMounted = true;
    if (scope.args.length && scope.args[0] === '--hard') {
        service.volumeMounted = false;
    }
    var r = {},
        containerName = [scope.appdef.project.slug, scope.appdef.slug, scope.repo.branch, service.name].join('-'),
        hostConfig = {};

    if ("links" in service) {
        r.Links = service.links.map(function(linkname){
            var containerName = [scope.appdef.project.slug, scope.appdef.slug, scope.repo.branch, linkname].join('-');
            var alias = linkname;
            return [containerName,alias].join(':');
        });
    }
    if ("links" in service) {
        hostConfig.links = r.Links;
    }

    if ("volumes" in service) {
        r.Volumes = {};
        service.volumes.forEach(function(volumeMap){
            var firstPart = volumeMap.split(':')[1];
            r.Volumes[firstPart] = {};
        });
        if (service.volumeMounted) {
            hostConfig.Binds = service.volumes.map(function(volumeMap){
                return volumeMap.replace(/^\./,process.cwd());
            });
        }
    }
    if ("volumes_from" in service) {
        hostConfig.VolumesFrom = service['volumes_from'].map(function(sname){
            return [scope.appdef.project.slug, scope.appdef.slug, scope.repo.branch, sname].join('-');
        });
    }
    if ("ports" in service) {
        r.ExposedPorts = {};
        service.ports.forEach(function(port){
            var k = port + '/tcp';
            r.ExposedPorts[k] = {};
        });
        if (service.ambassador) {
            r.PublishAllPorts = true;
            hostConfig.PublishAllPorts = true;
        }
    }
    if ("command" in service) {
        r.Cmd = service.command;
    }
    if ("environment" in service) {
        r.Env = [];
        for (let k in service.environment) {
            if (service.environment[k].length && service.environment[k].indexOf('#') !== 0) {
                r.Env.push(k+'='+service.environment[k]);    
            }
        }
    }
    r.Labels = {
        "io.sjc.orchestra.version": scope.appdef.orchestra.version,
        "io.sjc.orchestra.project.name": scope.appdef.project.name,
        "io.sjc.orchestra.project.slug": scope.appdef.project.slug,
        "io.sjc.orchestra.app.name": scope.appdef.name,
        "io.sjc.orchestra.app.slug": scope.appdef.slug,
        "io.sjc.orchestra.service.name": service.name,
        "io.sjc.orchestra.service.ambassador": (service.ambassador || false).toString(),
        "io.sjc.orchestra.service.volumeMounted": service.volumeMounted.toString(),
        "io.sjc.orchestra.ref": scope.repo.branch,
        "io.sjc.orchestra.appdef": JSON.stringify( scope.appdef )
    };
    r.Image = 'sean9999/'+scope.appdef.project.slug+'-'+scope.appdef.slug+'-'+service.name+':'+scope.repo.branch;
    r.name = containerName;
    r.HostConfig = hostConfig;
    return r;
};

var appDefToRunOptions = function(scope,service){
    var r = {};
    /**
     *   Note: For backwards compatibility, this endpoint accepts a HostConfig as JSON-encoded request body. See create a container for details.
     */
    return r;
};

var run = function(good,bad) {
    var scope = this;
    scope.enhance(function(err) {
        var services = Object.keys(scope.appdef.services).map(function(serviceName){
            //  make an array of services, with the ambassador being last
            var service = scope.appdef.services[serviceName];
            service.name = serviceName;
            return service;
        });
        services.sort(function(a,b){
            if ( "ambassador" in a && a.ambassador === true ) {
                return 1;
            }
            if ( "ambassador" in b && b.ambassador === true ) {
                return -1;
            }
            return 0;
        });

        var ambassador = services[ services.length - 1 ];

        var output = 'Running SJC App ' + scope.appdef.project.name + ', ' + scope.appdef.name + ', branch: ' + scope.repo.branch;
        var doIt = function() {
            var service, createOptions={}, runOptions = {}, imageName, containerName;
            if (services.length) {
                output += "\n";
                service = services.shift();
                runOptions.name = [scope.appdef.project.slug, scope.appdef.slug, scope.repo.branch, service.name].join('-');
                createOptions = appDefToCreateOptions(scope,service);
                runOptions = appDefToRunOptions(scope,service)
                imageName = 'sean9999/'+scope.appdef.project.slug+'-'+scope.appdef.slug+'-'+service.name+':'+scope.repo.branch;
                containerName = [scope.appdef.project.slug, scope.appdef.slug, scope.repo.branch, service.name].join('-');
                var c = dockerToolbox.docker.getContainer(containerName);
                if (c) {
                    c.stop(function(err,data) {
                        c.remove(function(err,data){
                            dockerToolbox.docker.createContainer(createOptions,function(err,container){
                                if (err) {
                                    console.trace(err);
                                    bad(err);
                                }
                                if (service.ambassador) {
                                    ambassador.container = container;
                                }
                                container.start(runOptions,function(err,data) {
                                    restClient.post(data,function(err,ok) {
                                        if (err) {
                                            console.trace(err);
                                            bad(fancy('Service '+service.name+' was not started','error'));
                                        } else {
                                            //good(fancy('The container was started','success'));
                                            output += 'Service ' + service.name + ' was started.';
                                            doIt();
                                        }
                                    });
                                });
                            });
                        });
                    });
                } else {
                    dockerToolbox.docker.createContainer(createOptions,function(err,container){
                        if (service.ambassador) {
                            ambassador.container = container;
                        }
                        container.start(runOptions,function(err,data) {
                            restClient.post(data,function(err,ok) {
                                if (err) {
                                    console.trace(err);
                                    bad(fancy('Service '+service.name+' was not started','error'));
                                } else {
                                    //good(fancy('The container was started','success'));
                                    output += 'Service ' + service.name + ' was started.';
                                    doIt();
                                }
                            });
                        });
                    });
                }
            } else {
                if (scope.args.length && scope.args.indexOf('--watch') > -1 ) {
                    console.log(output + "\n" + fancy('Orchestra app '+scope.appdef.project.name+' ☞  '+scope.appdef.name+' : '+scope.repo.branch+' now running','success'));
                    
                    //  stream logs from the ambassador
                    //  @TODO: allow the user to choose to stream logs from another service, or all services
                    var logStream = new stream.PassThrough();
                    logStream.on('data', function(chunk){
                        process.stdout.write(chunk);
                    });
                    ambassador.container.logs(
                        {
                            follow: true,
                            stdout: true,
                            stderr: true
                        },
                        function(err, stream){
                            if(err) {
                                return logger.error(err.message);
                            }
                            ambassador.container.modem.demuxStream(stream, logStream, logStream);
                            stream.on('finish',function(){
                                console.log('FINISH!!!');
                            });
                            stream.on('error',function(code){
                                console.log('ERROR',code);
                            });
                            stream.on('close', function() {
                                console.log('THE STREAM WAS CLOSED');
                            });
                            stream.on('end', function() {
                                logStream.end('\n');
                                good( fancy('Stream ended','error') );
                            });
                        }
                    );
                    process.on('SIGINT', () => {
                        console.log('Exiting orchestra log watcher');
                        good(true);
                        process.exit();
                    });
                } else {
                    good(output + "\n" + fancy('Orchestra app '+scope.appdef.project.name+' ☞  '+scope.appdef.name+' : '+scope.repo.branch+' now running','success'));
                }
            }
        };
        doIt();
    });
};

module.exports = function(Command,scope){
    return new Command(scope,run);
};