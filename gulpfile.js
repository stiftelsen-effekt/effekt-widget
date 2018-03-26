const gulp = require('gulp')
const sass = require('gulp-sass')
const gutil = require('gulp-util')
const tap = require('gulp-tap')
const uglify = require('gulp-uglify')
const browserify = require('browserify')
const buffer = require('gulp-buffer')
const watch = require('gulp-watch')
const rename = require('gulp-rename')

gulp.task('style', function() {
    gulp.src('style/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('style/'))
})

gulp.task('script', function() {
    return gulp.src('script/widget.js', {read: false})
    .pipe(tap(function (file) {
        gutil.log('bundling ' + file.path);
        file.contents = browserify(file.path, {debug: true}).bundle();
    }))
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest("./"))
    /*.pipe(buffer())
    .pipe(uglify())
    .pipe(rename("bundle.min.js"))
    .pipe(gulp.dest('./'));*/
})

gulp.task('default', ['style', 'script'])

gulp.task('watch', function() {
    gulp.watch('style/**/*.scss', ['style'])
    gulp.watch('script/**/*.js', ['script'])
})