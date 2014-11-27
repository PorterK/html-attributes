/*!
 * html-attributes
 * https://github.com/alexmingoia/html-attributes
 */

'use strict';

var gulp = require('gulp');
var Browserify = require('browserify');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var instrument = require('gulp-instrument');
var jsdoc2md = require('jsdoc-to-markdown');
var fs = require('fs');
var file = require('gulp-file');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('jshint', function () {
  return gulp.src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

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

gulp.task('browserify-tests', function() {
  var bundler = new Browserify();

  bundler.add('./test/html-attributes.js');
  bundler.exclude('../lib-cov/html-attributes');

  return bundler.bundle()
    .pipe(source('tests.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('mocha-phantomjs', ['browserify-tests'], function() {
  return gulp.src('test/html-attributes.html')
    .pipe(mochaPhantomJS({
      mocha: {
        timeout: 6000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      }
    }));
});

gulp.task('test', ['mocha-phantomjs'], function () {
  return gulp.src('dist/tests.js').pipe(clean());
});

gulp.task('instrument', function() {
  return gulp.src('lib/**/*.js')
    .pipe(instrument())
    .pipe(gulp.dest('lib-cov'));
});

gulp.task('docs', function(done) {
  jsdoc2md.render('./lib/*.js', {
    template: './lib/readme.hbs'
  })
  .on('error', done)
  .on('end', done)
  .pipe(fs.createWriteStream('README.md'))
});

gulp.task('coverage', ['instrument'], function() {
  process.env.JSCOV = true;
  return spawn('./node_modules/gulp-mocha-phantomjs/node_modules/mocha-phantomjs/node_modules/mocha/bin/mocha', [
    'test', '--reporter', 'html-cov'
  ]).stdout
    .pipe(source('coverage.html'))
    .pipe(gulp.dest('./'));
});


gulp.task('watch', ['jshint', 'test'], function () {
  gulp.watch(['lib/**/*.js', 'test/**/*.js'], ['jshint', 'test']);
});

gulp.task('clean', function() {
  return gulp.src(['lib-cov', 'coverage.html', 'npm-debug.log']).pipe(clean());
});

gulp.task('default', ['watch']);
