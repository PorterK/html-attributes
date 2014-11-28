/*!
 * html-attributes
 * https://github.com/alexmingoia/html-attributes
 */

'use strict';

var gulp = require('gulp');
var Browserify = require('browserify');
var jsdoc2md = require('jsdoc-to-markdown');
var fs = require('fs');
var file = require('gulp-file');
var source = require('vinyl-source-stream');

gulp.task('wrap-umd', function() {
  var bundler = new Browserify({
    standalone: 'html-attributes'
  });

  bundler.add('./lib/html-attributes.js');
  bundler.exclude('../lib-cov/html-attributes');

  return bundler.bundle()
    .pipe(source('html-attributes.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('json', function() {
  var attrs = JSON.stringify(require('./lib/html-attributes'));

  return file('html-attributes.json', attrs, { src: true })
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['wrap-umd', 'json']);

gulp.task('docs', function(done) {
  jsdoc2md.render('./lib/*.js', {
    template: './lib/readme.hbs'
  })
  .on('error', done)
  .on('end', done)
  .pipe(fs.createWriteStream('README.md'))
});
