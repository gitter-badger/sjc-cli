"use strict";

var util = require('util');

var run = function(good,bad) {
    var scope = this;
    this.enhance(function(err,newscope){
        good(console.log(util.inspect(scope,{showHidden: true,depth:null,colors:true})));
    });
};

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
