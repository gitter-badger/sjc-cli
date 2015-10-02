var assert = require('assert'),
    cli = require('../src/cli.js'),
    git = require('../src/git.js'),
    spawn = require("../src/spawn.js");

describe('sjc-cli', function () {
    describe('helpers', function () {
        it('spawn', function () {
            // Assumption: Git is actually installed on the target system (Windows, Linux, OSX, etc)
            // Spawn should always return 0 (zero) for successful spawns
            return spawn("git", ["--version"], {}).then(function (result) {
                assert.ok(result === 0);
            });
        });
        
        it('git currentBranch', function () {
            // Result should equal whatever branch the test is being run against
            return git.currentBranch().then(function (result) {
                assert.ok(result && (result !== ''));
            });
        });
        
        it('git currentRev', function () {
            // Result should equal whatever branch the test is being run against
            return git.currentRev().then(function (result) {
                var r = new RegExp("^[0-9a-f]+$", 'gi');
                assert.ok(r.test(result));
            });
        });
    
    });
    describe('commands', function () {
        it('dogsays woof', function () {
            return cli.run('dogsays', ['woof']).then(function (result) {
                assert.ok(result === '🐕   says WOOF!');
            });
        });

        it('up', function () {
            return cli.run('up').then(function (result) { 
                assert.ok(result === '');
            });
        });
    });
    

});