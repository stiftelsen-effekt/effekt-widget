const gulp = require('gulp');
const { parallel, series } = require('gulp')

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
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const fs = require('fs')

const customOpts = {
  entries: ['./script/widget.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = browserify(customOpts);

b.on('update', bundle);
b.on('log', log.info);

function substitute() {
  let api_url

  console.log(process.env.EFFEKT_API_URL)
  console.log(process.env.NODE_ENV)

  if(process.env.EFFEKT_API_URL)
    api_url = process.env.EFFEKT_API_URL
  else if(process.env.NODE_ENV == "dev")
    api_url = "https://dev.data.gieffektivt.no/"
  else if(process.env.NODE_ENV == "stage")
    api_url = "https://stage.data.gieffektivt.no/"
  else if(process.env.NODE_ENV == "production")
    api_url = "https://data.gieffektivt.no/"
  else
    throw new Error("Could not detirmine API url")

  console.log(api_url)

  return gulp.src('./dist/bundle*.js')
    .pipe(replace('ENV.API_URL', api_url))
    .pipe(gulp.dest('./dist/'))
}

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
  let cdn_url
    
  if(process.env.NODE_ENV == "production")
    cdn_url = "https://storage.googleapis.com/effekt-widget/assets/"
  else
    cdn_url = "https://storage.googleapis.com/effekt-widget-dev/assets/"

  return gulp.src('./style/**/*.scss')
      .pipe(replace('ENV.CDN_URL', cdn_url))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist'));
}

function formatWidgetHTML() {
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

/**
 * This step fetches the html from widget.html and pastes it into the correct
 * location in widget-host-local.htm. Use widget-host-local for testing changes
 * made to widget.htm locally. See comment in widget-host-local.htm for further
 * comments.
 */
function copyWidgetToLocalDev() {
  //Read widget.html
  let widgetHtml = fs.readFileSync('widget.htm').toString()

  //Insert into widget-local.htm
  let widgetHostLocalHtml = fs.readFileSync('widget-host-local.htm').toString()
  let hostLocalDOM = new JSDOM(widgetHostLocalHtml)

  let container = hostLocalDOM.window.document.body.querySelector("#donation-widget-container")
  container.innerHTML = widgetHtml

  //Save file
  let finalHTML = hostLocalDOM.serialize()
  fs.writeFileSync("widget-host-local.htm", finalHTML)

  return Promise.resolve('Completed moving HTML')
}

exports.build = parallel(series(bundle, substitute), styles, series(formatWidgetHTML, copyWidgetToLocalDev))
