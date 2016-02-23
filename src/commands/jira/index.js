"use strict";

/**
 * Open Jira to the bug that matches the current branch
 * @example: sjc jira
 * 
 */

const JIRA_BASE_URL = 'https://stjosephcontent.atlassian.net/browse/';

var spawn = require('child_process').spawn;

//  platform-specifc config
var ubuntu = {
    command: 'xdg-open',
};
var osx = {
    command: 'open'
};
var options = {
    stdio: ['ignore','ignore','ignore'],
    detached: true
};
var params = {
    args: []
};
ubuntu.options = osx.options = options;
switch (process.platform.toLocaleLowerCase()) {
    case 'darwin':
    params.command = osx.command;
    params.options = osx.options;
    break;
    case 'linux':
    default:
    params.command = ubuntu.command;
    params.options = ubuntu.options;
    break;
}

var jiraify = function(branchName) {
    var r;
    var pattern = /^[A-Z]{2,7}\-[0-9]{1,4}/i;
    r = branchName.match(pattern).pop();
    return r;
}

var run = function(good,bad) {
    this.enhance(function(err,scope){
        var ticketNumber = jiraify(scope.repo.branch);
        params.args.push(JIRA_BASE_URL+ticketNumber);
        spawn(params.command,params.args,params.options);
        good(true);
    });
};    

module.exports = function(Command,scope) {
    return new Command(scope,run);
};
