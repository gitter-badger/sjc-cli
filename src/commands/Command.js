"use strict";

/**
 * used as a constructor to instiate commands in SJC CLI
 * @arg {String} commandName - The name of the command. Convenient but not crucial. Helps with debugging
 * @arg {Array} args - The arguments passed into the command
 * @arg {Object} scope - A collection of "global-type" variables that should be available to any command that wants it
 * @arg {Function} run - The logic of the command lives here.
 */

var good = console.log;
var bad = console.error;

Object.assign = function(a,b){
    var a = JSON.parse(JSON.stringify(b));
    return a;
};

module.exports = function(scope,run) {
    if (process.stdin.isTTY) {
        return new Promise(function(resolve,reject) {
            //run(scope,resolve,reject);
            run.call(scope,resolve,reject);
        });
    } else {
        return new Promise(function(resolve,reject) {
            var exitcode = 0;
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            process.stderr.on('data', function() {
                exitcode = 1;
                bad(data);
            });
            process.stdin.on('data', function(data) {
                //run([data].concat(args),good,bad);
                var newScope = Object.assign({},scope);
                newScope.args = [data].concat(scope.args);
                run.call(newScope,good,bad);
            });
            process.stdin.on('end', function(data) {
                resolve();
            });
        });
    }
};
