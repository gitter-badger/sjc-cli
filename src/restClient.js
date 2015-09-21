"use strict";

var qs = require('qs');
var request = require('request');

const DEFAULT_ENDPOINT = 'app-registry.local.dev';
const DEFAULT_PATH = '/v0.0.1'

request(options,function(error,response,body){
    good(fancy(scope.appdef.project.name + ' / ' + scope.appdef.name + ' : ' +  branch + ' now running at ' + permalink ,'success'));
});

var client = {
    post: function(data,cb) {
        var postData = qs.stringify(data);
        var headers = {
            'User-Agent': 'Ochestra Rest Client/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        var options = {
            hostname: 'app-registry.local.dev',
            port: 80,
            headers: headers,
            url: 'http://app-registry.local.dev/v0.0.1/ambassadors',
            method: 'POST',
            form: postObject
        };
        request(options,function(error,response,body) {
            cb(error,body);
        });
    },
    delete: function(cb) {
        var headers = {
            'User-Agent': 'Ochestra Rest Client/0.0.1'
        };
        var options = {
            hostname: 'app-registry.local.dev',
            port: 80,
            headers: headers,
            url: 'http://app-registry.local.dev/v0.0.1/ambassadors',
            method: 'DELETE'
        };
        request(options,function(error,response,body) {
            cb(error,body);
        });
    }
};
