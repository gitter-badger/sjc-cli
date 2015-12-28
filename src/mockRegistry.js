"use strict";

var response = [];

var endpoint = function(handle,provider,host) {
    var r = {
        handle: handle,
        provider: provider,
        host: host
    };
    return r;
};

var row = function(appname,branch,port,endpoints,repo){
    var r = {
        appname: appname,
        branch: branch,
        port: port,
        endpoints: endpoints,
        repo: repo
    };
    return r;
};

response.push(row('cerebrum', 'master', 400434, endpoint('prod','amazon','324.43.42.19'), 'https://github.com/stjosephcontent/cerebrum'));
response.push(row('cerebrum', 'stage', 98758, endpoint('stage','amazon','324.80.99.101'), 'https://github.com/stjosephcontent/cerebrum/tree/stage'));
response.push(row('cerebrum', 'CE-43', 56574, endpoint('amazon','324.43.42.19'), 'https://github.com/stjosephcontent/cerebrum/tree/CE-43'));
response.push(row('canonfeatures', 'master', 90891, endpoint('prod','amazon','324.43.42.19'), 'https://github.com/stjosephcontent/canonfeatures'));
response.push(row('canonfeatures', 'dockerized', 84837, endpoint('stage','amazon','324.80.99.101'), 'https://github.com/stjosephcontent/canonfeatures/tree/dockerized'));
response.push(row('canonfeatures', 'CF-88', 95738, endpoint('amazon','324.43.42.19'), 'https://github.com/stjosephcontent/canonfeatures/tree/CF-88'));
response.push(row('cerrocoyote', 'develop', 48392, endpoint('amazon','324.43.42.19'), 'https://github.com/stjosephcontent/cerrocoyote/tree/develop'));

module.exports = function(resource,representation,queryparams) {

    switch (resource) {
        case 'applications':
        var r = response;
        break;
    }

    return new Promise(function(resolve,reject){
        resolve(r);
    });

};