var commandName = 'rot13';

describe(commandName+" suite",function(){
    var command = require(__dirname+'/../../src/commands/'+commandName+'/index.js').bind(command,commandName),
    vars = require(__dirname+'/../../src/vars.js'),
    child_process = require('child_process'),
    fs = require('fs');

    it('rot13-encodes a small string when invoked with a command-line argument',function(done){
        var args = ['fun1'];
        command(args,vars).then(function(result){
            expect(result).toBe('sha1');
            done();
        }).catch(function(err){
            //  fail on purpose
            expect('response').not.toBe('an error');
            done();
        });
    },vars.test.timeout);

    
    it('rot13-encodes three lines when piped in like "cat /etc/passwd | sjc rot13"',function(done){
        var proc = child_process.exec('cat '+__dirname+'/rot13.test.txt | sjc rot13',{cwd:__dirname},function (error, stdout, stderr) {

            console.log(stdout,stderr,error);

            if (error) {
                expect(error).not.toBe('an error');
            }
            if (stderr) {
                console.error(stderr);
            }
            expect(stdout).toMatch(/fun1/);
            done();
        });
    },3000);
    

});
