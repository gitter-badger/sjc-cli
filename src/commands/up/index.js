"use strict";

/**
 * Turns on Docker Machine
 * @example: sjc up
 * 
 */

var d = require('../../docker-toolbox.js');

var run = function () {
   var self = this;
   console.log("Note: Cold starting VirtualBox VM on Windows and OSX takes a minute.");
   d.machine.start(function (err, data) {
      if (err) {
         self.reject(err);
      } else {
         self.resolve(data);
      }
   });
};

module.exports = run;