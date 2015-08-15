var commandName = 'weirdfacts';

describe(commandName+" suite",function(){

    var scope = require(__dirname+'/../../src/scope.js');
    scope.args[0] = commandName;
    var command = require(__dirname+'/../../src/commands/'+commandName+'/index.js').bind(command,scope);
    var child_process = require('child_process');
    var fs = require('fs');

    it('should display 7 weird facts',function(done){
        var args = ['7'];
        var proc = child_process.exec('sjc weirdfacts 7',{},function (error, stdout, stderr){
            var lines = stdout.split("\n").filter(function(line){ return (line.length); });
            expect(lines.length).toBe(7);
            expect(stdout).toMatch(/Star Wars/g);
            done();
        });
    },2000);

});
