"use strict";

var qs = require('qs');
var request = require('request');

const DEFAULT_ENDPOINT = 'app-registry.local.dev';
const DEFAULT_PATH_ROOT = 'v0.0.1';

var client = {
    post: function(data,cb) {
        var postData = qs.stringify(data);
        var headers = {
            'User-Agent': 'Ochestra Rest Client/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        var headers = {};        
        var options = {
            hostname: 'app-registry.local.dev',
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
    get: function() {
        var headers = {
            'User-Agent': 'Ochestra Rest Client/0.0.1'
        };
        var options = {
            hostname: 'app-registry.local.dev',
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
            'User-Agent': 'Ochestra Rest Client/0.0.1'
        };
        var options = {
            hostname: 'app-registry.local.dev',
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