"use strict";

var d = require('../../docker-toolbox.js');

var run = function(good,bad) {
    d.getContainer(this.args[0],function(err,container) {
        if (err) {
            bad(err);
        } else {
            if (container === null) {
                bad(Error('The container could not be found'));
            } else {
                d.docker.getContainer(container.id).stop(function(err,data){
                    if (err) {
                        bad(err);
                    } else {
                        good(fancy('The thing was good!','success'));
                    }
                });
            }
        }
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
