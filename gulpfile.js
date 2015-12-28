"use strict";

const CODE_GLOBS = ['src/**/*.js'];
const SPEC_GLOBS = ['test/**/*.js'];

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    packageJSON = require('./package.json'),
    jasmine = require('gulp-jasmine'),
    jscs = require('gulp-jscs'),
    colour = require('bash-color'),
    config = require('./src/config.json');

gulp.task('lint', function() {
    gulp.src(CODE_GLOBS)
        .pipe(jshint(packageJSON.jshintConfig))
        .pipe(jshint.reporter('default', { verbose: true }))
        .pipe(jscs({
            "configPath": "lint/jscs.javascript.node.json"
        }));
});

var loisLane = {
    jasmineStarted: function(suiteInfo) {
        console.log( colour.purple('--------------------------------------------'));
    },
    suiteStarted: function(suite) {
        console.log("");
        console.log(colour.cyan('//' + "\t" + suite.description,true));
    },
    specStarted: function(spec) {
        //  no action required
    },
    specDone: function(spec){
        if (spec.status === 'passed') {
            console.log( "\t" + spec.fullName + ' ' + config.message.success.char );
        } else {
            console.log( "\t" + spec.fullName + ' ' + config.message.error.char );
        }
        spec.failedExpectations.forEach(function(exp){
            console.log(colour.red("\t" + exp.message));
            console.error( exp.stack );
        });
    },
    suiteDone: function(suite){
        //  no action required
    },
    jasmineDone: function(){
        console.log("");
        console.log( colour.purple('--------------------------------------------'));
    }
};

gulp.task('test',function() {
    gulp.src(SPEC_GLOBS).pipe(jasmine({
        "verbose": true,
        "includeStackTrace": true,
        "reporter": loisLane
    }));
});

gulp.task('burp',function() {
   gulp.src(['test/commands/rot13.js','test/commands/weirdfacts.js']).pipe(jasmine()); 
});

gulp.task('default', ['lint', 'test']);
