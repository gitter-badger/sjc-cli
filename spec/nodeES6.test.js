"use strict";

var fs = require('fs');

describe("The right version of node",function(){
    fs.readFile(__dirname+'/../install_nodeES6.sh',{encoding:'utf8'},function(err,installscript){
        fs.readFile(__dirname+'/../nodeES6',{encoding:'utf8'},function(err,binscript){
            var nodeVersion = function(contents){
                //  extract the node version from the contents of a text file
                var pattern = /(n )(io )?(bin )?((\d\.)*\d)/,
                    matches = contents.match(pattern),
                    r = [
                        matches[1],
                        matches[2],
                        matches[4]
                    ];
                return r;
            };            
            it('should refer to the same node version in two files',function(done){
                expect(nodeVersion(binscript)).toBe(nodeVersion(installscript));
                done();
            });
        });
    });
});
