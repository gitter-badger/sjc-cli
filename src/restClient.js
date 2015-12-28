"use strict";

var qs = require('qs');
var request = require('request');
var scope = require('./scope.js');

const DEFAULT_ENDPOINT = 'app-registry.' + scope.conf.docker.machine.orchestra.tld;
const DEFAULT_PATH_ROOT = 'v' + scope.conf.orchestra.version;

var client = {
    post: function(data,cb) {
        var postData = qs.stringify(data);
        var headers = {
            'User-Agent': 'Ochestra Rest Client/' + scope.conf.orchestra.version,
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        var options = {
            hostname: DEFAULT_ENDPOINT,
            port: 80,
            headers: headers,
            url: 'http://' + DEFAULT_ENDPOINT + '/' + DEFAULT_PATH_ROOT + '/ambassadors',
            method: 'POST',
            form: postData
        };
        request(options,function(error,response,body) {
            cb(error,body);
        });
    },
    get: function(cb) {
        var headers = {
            'User-Agent': 'Ochestra Rest Client/' + scope.conf.orchestra.version
        };
        var options = {
            hostname: DEFAULT_ENDPOINT,
            port: 80,
            headers: headers,
            url: 'http://' + DEFAULT_ENDPOINT + '/' + DEFAULT_PATH_ROOT + '/ambassadors',
            method: 'GET'
        };
        request(options,function(error,response,body) {
            cb(error,body);
        });
    },
    delete: function(cb) {
        var headers = {
            'User-Agent': 'Ochestra Rest Client/' + scope.conf.orchestra.version
        };
        var options = {
            hostname: DEFAULT_ENDPOINT,
            port: 80,
            headers: headers,
            url: 'http://' + DEFAULT_ENDPOINT + '/' + DEFAULT_PATH_ROOT + '/ambassadors',
            method: 'DELETE'
        };
        request(options,function(error,response,body) {
            cb(error,body);
        });
    }
};

module.exports = client;
