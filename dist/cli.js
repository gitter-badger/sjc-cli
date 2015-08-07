'use strict';

var command = process.argv[2] || "help";

var remaining_commands = process.argv.slice(2);

require('./commands/' + command + '/index.js')(remaining_commands);