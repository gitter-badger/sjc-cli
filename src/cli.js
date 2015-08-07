

var command = process.argv[2] || "help";


require('./commands/'+command+'/index.js')(process.argv.slice(3));