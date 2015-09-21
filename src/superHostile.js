"use strict";

/**
 * Run hostile with escalated privs.
 * Note: this runs the CLI version, but exposes the same API as the js version. THere is not perfect parity between js and CLI version.
 */

var proc = require('child_process');
var scope = require('./scope');

var superHostile = {
    set: function(ip,host,cb) {
        proc.exec('sudo hostile set '+ip.trim()+' '+host.trim(),cb);
    },
    remove: function(ip,host,cb) {
        proc.exec('sudo hostile remove'+ip.trim()+' '+host.trim(),cb);
    },
    list: function(cb) {
        var nonblank = function(line) {
            return /\w/.test(line);
        };
        var localTLD = function(row) {
            var pat = new RegExp(scope.conf.localTLD+'$');
            return ( pat.test(row.host) );
        };
        proc.exec('sudo hostile list',function(err,rawdata){
            var table = rawdata.split("\n").filter(nonblank).map(function(rawrow) {
                var cells = rawrow.split(/\s+/).filter(function(cell){ return cell.length; });
                return {
                    ip: cells[0].trim(),
                    host: cells[1].trim()
                };
            }).filter(localTLD);
            cb(err,table);
        });
    },
    get: function(host,cb) {
        //  returns the record for that host, or error
        var magicrecord;
        superHostile.list(function(err,hosts) {
            magicrecord = hosts.filter(function(record) {
                return record.host == host.trim();
            }).pop();
            if (!magicrecord) {
                err = Error('There was no record for '+host.trim());
            }
            cb(err,magicrecord);
        });
    }
};

module.exports = superHostile;
