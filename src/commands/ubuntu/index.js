"use strict";

var run = function(good,bad) {
    var scope = this;
    scope.enhance(function(){
        good(scope);
    });
};
