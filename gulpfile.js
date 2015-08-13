"use strict";

const CODE_GLOBS = ['src/**/*.js','*.js'];
const SPEC_GLOBS = ['spec/**/*.test.js'];

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var packageJSON = require('./package.json');
var jasmine = require('gulp-jasmine');


gulp.task('jshint', function(){
    gulp.src(CODE_GLOBS)
        .pipe(jshint(packageJSON.jshintConfig))
        .pipe(jshint.reporter('default', { verbose: false }));
});

gulp.task('jasmine',function(){
    gulp.src(SPEC_GLOBS).pipe(jasmine());
});

gulp.task('default', ['jshint', 'jasmine']);
