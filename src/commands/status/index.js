"use strict";

/**
 * execute docker-machine status default and return that.
 * Maybe in the future it will do other stuff
 */

var machine = require('../../docker-toolbox.js').machine;

var run = function () {
   var self = this;
   machine.getStatus(function (err, data) {
      if (err) {
         self.reject(err);
      } else {
         self.resolve(data);
      }
   });
};

module.exports = run;