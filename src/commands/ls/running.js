"use strict";

var d = require('../../docker-toolbox.js'),
    columnify = require('columnify'),
    colour = require('bash-color');

const ERR_NOAPPS = 'no orchestra apps are running';

var run = function(good,bad){
    var table, tableconfig = {}, scope = this;
    d.getRunningServices(function(err,services){
        if (err) {
            bad(err);
        } else {
            var cols = [];
            var f = function(x) { return x; };
            var row = {};
            var lines = {};
            if (services.length) {
                cols = services.map(function(container,n) {
                    row = {};
                    if (container.mounted === 'yes') {
                        f = function(x) {
                            return colour.green(x);
                        };
                    } else {
                        f = function(x) { return x; };
                    }
                    Object.keys(container).forEach(function(k) {
                        var v = container[k];
                        switch (k) {
                            case 'selected':
                            case 'ambassador':
                            case 'created':
                            //  we don't need this field
                            break;
                            default:
                            row[k] = f(v);
                            lines[k] = colour.blue('-'.repeat( Math.max((''+v).length,k.length)));
                        }
                    });
                    if (container.selected) {
                        row[' '] = scope.conf.message.default.char;
                    } else {
                        row[' '] = '';
                    }
                    
                    return row;
                });
                cols.unshift(lines);
                table = columnify(cols,tableconfig);
                good(table);
            } else {
                bad(ERR_NOAPPS);
            }
        }
    });
};

module.exports = run;
