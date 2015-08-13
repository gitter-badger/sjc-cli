var commandName = 'help';

describe(commandName+" suite",function(){
    var command = require(__dirname+'/../../src/commands/'+commandName+'/index.js').bind(command,commandName),
    vars = require(__dirname+'/../../src/vars.js');

    it('shows general help',function(done){
        var args = [];
        command(args,vars).then(function(result){
            expect(result).toMatch(/sjc is a command line utility/);
            done();
        }).catch(function(err){
            //  fail on purpose
            expect('response').toBe('not an error');
            done();
        });
    },vars.test.timeout);

    it('shows help on rot13',function(done){
        var args = ['rot13'];
        command(args,vars).then(function(result){
            expect(result).toMatch(/It takes lines of input as unix pipes, and returns those same lines rot13 encoded/);
            done();
        }).catch(function(err){
            expect(err).toBe('a valid result');
            done();
        });
    },vars.test.timeout);

});
