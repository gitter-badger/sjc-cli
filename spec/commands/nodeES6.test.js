"use strict";

var fs = require('fs');

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

describe("The same version of node",function(){
    it('should be referenced in two files',function(done){
        fs.readFile('./install_nodeES6.sh',{encoding:'utf8'},function(err,installscript){
            fs.readFile('./nodeES6',{encoding:'utf8'},function(err,binscript){
                expect(nodeVersion(binscript)).toEqual(nodeVersion(installscript));
                done();
            });
        });
    });
});
