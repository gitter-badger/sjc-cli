'use strict';

/* 
 * This scope module merges information from current command line params, config.json and appdef.json (if present)
 * to create a properties bag for use by other modules. It is exported as a constructed object (aka singleton) so 
 * that the initial properties are staticaly available elsewhere. It should be 'required' at the highest level 
 * namely cli.js
 * 
 */

var fs = require('fs');
var conf = require('./config.json');
var git = require('./git.js');

var scope = function () {
    this.commandName = process.argv[2] || 'help';
    this.args = process.argv.slice(3);
    this.conf = conf;
    this.appdef = null;
    this.repo = null;
}

// to-do: scope.prototype.enhance is untested after prototypifing
scope.prototype.enhance = function () {
    return new Promise(function (resolve, reject) {
        git.currentBranch().then(function (result) {
            scope.prototype.repo = {
                branch: result
            };
            git.currentRev().then(function (result) {
                scope.prototype.repo.rev = result;
                fs.readFile(process.cwd() + '/appdef.json', { encoding: 'utf8' }, function (err, appdefAsString) {
                    if (err) {
                        reject('There is no appdef file');
                    } 
                    else {
                        try {
                            scope.prototype.appdef = JSON.parse(appdefAsString);
                        } 
                        catch (e) {
                            err = e;
                        }
                        resolve(scope);
                    }
                });
            }).catch(function (reason) {
                // git.currentRev() failed
                reject(reason);
            });
        }).catch(function (reason) {
            // git.currentBranch() failed
            reject(reason);
        });
    });
}

module.exports = new scope();