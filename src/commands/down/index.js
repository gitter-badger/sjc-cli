"use strict";


/**
 * Spin down docker machine. Takes no arguments. it simply invokes "docker-machine stop default"
 * @returns (stdout) - whatever the docker-machine command said
 */

var d = require('../../docker-toolbox.js');

var run = function () {
   // this.resolve and this.reject passed in via fn.apply() from cli.js
   var self = this;
   
   d.machine.stop(function (err, data) {
      if (err) {
         self.reject(err);
      } else {
         self.resolve(data);
      }
   });
};

module.exports = run;