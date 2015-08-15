var commandName = 'dogsays';

describe(commandName+" suite",function(){
    
    var scope = require(__dirname+'/../../src/scope.js');
    scope.args[0] = commandName;
    var command = require(__dirname+'/../../src/commands/'+commandName+'/index.js').bind(command,scope);

    it('should say WOOF! WOOF!', function(done) {
        var args = ['woof','woof'];
        command(args,vars).then(function(bark){
            expect(bark).toMatch(/WOOF! WOOF!/);
            done();
        }).catch(function(err){
            expect('response').toNotBe('an error');
        });
    },vars.test.timeout);

    it('should produce an error because dogs don`t say meow',function(done){
        var args = ['meow','quack','hiss'];
        command(['meow'],vars).then(function(result){
            //	fail because we expected an error
            expect(result).toBe('an error');
        }).catch(function(result){
            expect(result instanceof Error).toBe(true);
            done();
        });
    },vars.test.timeout);

});
