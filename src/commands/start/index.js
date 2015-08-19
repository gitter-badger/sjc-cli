"use strict";

var run = function(good,bad) {
    var malleability = 'soft';    
    if ("--hard" in this.args) {
        malleability = 'hard';
    }
};

module.exports = function(Command,scope) { 
    return new Command(scope,run);
};
