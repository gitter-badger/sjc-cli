/**
 * execute docker exec commands thusly:
 * sjc service nodejs exec uname -a
 * becomes
 * docker exec {{containerid}} uname -a
 */

var run = function(good,bad) {
    var serviceName, service;
    if (this.args.length === 0) {
        bad(Error('You need to specify a service'));
    } else {
        serviceName = this.args[0];
        this.enhance(function(err,scope){
            if (err) {
                bad(err);
            } else {
                if (serviceName in scope.appdef.services) {
                    service = scope.appdef.services[serviceName];
                    good(service);
                } else {
                    bad(Error('That service does`t exist in this app'));
                }
            }
        });
    }
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};