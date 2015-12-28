var commandName = 'weirdfacts';

describe(commandName,function(){

    var child_process = require('child_process');

    var num_facts = 3;

    it('should display '+num_facts+' weird facts',function(done) {

        var proc = child_process.spawn('sjc',['weirdfacts',num_facts],{encoding:'utf8'});

        proc.stdout.setEncoding('utf8');
        proc.stderr.setEncoding('utf8');

        var lines = [];

        var containingStarWars = function(line) {
            return /Star Wars/.test(line);
        };

        proc.stdout.on('data',function(data){
            lines = lines.concat(data.split("\n"));
        });

        proc.stderr.on('data',function(data){
            console.error(data);
            expect(true).toBe(false);
            done();
        });

        proc.on('close',function(exitCode){
            expect(lines.length).toBe(num_facts);
            //expect(lines.filter(containingStarWars)).toBe(1);
            done();
        });

        /*
        var proc = child_process.exec('sjc weirdfacts 7',{},function (error, stdout, stderr){
            var lines = stdout.split("\n").filter(function(line){ return (line.length); });
            expect(lines.length).toBe(7);
            expect(stdout).toMatch(/Star Wars/g);
            done();
        });
        */
        
    });

});
