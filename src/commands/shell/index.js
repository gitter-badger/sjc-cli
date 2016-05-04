var proc = require('child_process');

/*
 * @TODO: Make this work. Currently it does not because of spawn / TTY / stdio issues
 */

var run = function(good,bad) {

    this.enhance(function(err,scope){
        
        var serviceName = scope.args[0],
            target_container_name = [scope.appdef.project.slug,scope.appdef.slug,scope.repo.branch,serviceName].join('-'),
            params = {
                command: "docker",
                args: ['exec', '-it' ,target_container_name, '/bin/bash'],
                options: {
                    shell: '/bin/bash',
                    stdio: 'inherit'
                }
            },
            p;

        p = proc.spawn(params.command,params.args,params.options);
        //p = proc.exec([params.command].concat(params.args).join(' '),params.options,good);
        p.stdout.setEncoding('utf8');
        p.stderr.setEncoding('utf8');
        p.stdout.on('data', function(data){
            process.stdout.write( data.toUpperCase() );
        });
        p.stderr.on('data', function (data) {
            process.stderr.write( data );
        });
        p.on('close', function(exitCode){
            if (exitCode === 0) {
                good('all done interacting with container');
            } else {
                bad('process exited with ' + exitCode);    
            }
        });

    });

};

module.exports = function(Command,scope){
    return new Command(scope,run);
};
