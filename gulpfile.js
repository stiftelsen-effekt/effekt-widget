const gulp = require('gulp');
const { parallel } = require('gulp')

const sass = require('gulp-sass');
const minify = require('gulp-minify')
const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const log = require('gulplog');
const sourcemaps = require('gulp-sourcemaps');
const assign = require('lodash.assign');
var replace = require('gulp-replace');

const customOpts = {
  entries: ['./script/widget.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = browserify(customOpts);

b.on('update', bundle);
b.on('log', log.info);

function bundle() {
  return b.bundle()
    .on('error', log.error.bind(log, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(minify())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
}

function styles() {
    return gulp.src('./style/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
}

function html() {
  return gulp.src('./widget.htm')
    /*  Google Cloud Storage does not play nice with UTF-8 encoding.
        Replacing the characters with HTML entities fixes the problem,
        although it is of course a dirty fix. They way it is done here
        is terribly inefficent as we loop over the entire file six times,
        however since it is a build step, performance is not very important. */
    .pipe(replace('Æ', '&Aelig;'))
    .pipe(replace('æ', '&aelig;'))
    .pipe(replace('Ø', '&Oslash;'))
    .pipe(replace('ø', '&oslash;'))
    .pipe(replace('Å', '&Aring;'))
    .pipe(replace('å', '&aring;'))
    .pipe(gulp.dest('./dist'))
}

exports.build = parallel(bundle, styles, html)