"use strict";

var dockerToolbox = require('../../docker-toolbox.js');

var util = require('util');

var run = function(good,bad) {
    var scope = this;
    this.enhance(function(err,newscope){

        dockerToolbox.docker.listContainers(function(e,c){
            console.log(util.inspect(c,{showHidden: true,depth:null,colors:true}));
            good(scope);
        });

        //good(newscope);
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
