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

// add custom browserify options here
const customOpts = {
  entries: ['./script/widget.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
//var b = watchify(browserify(opts));
var b = browserify(customOpts);

// add transformations here
// i.e. b.transform(coffeeify);

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', log.info); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', log.error.bind(log, 'Browserify Error'))
    .pipe(source('bundle.js'))
    
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    .pipe(minify())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}

function styles() {
    return gulp.src('./style/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
}

function html() {
  return gulp.src('./widget.htm')
    .pipe(gulp.dest('./dist'))
}

exports.build = parallel(bundle, styles, html)