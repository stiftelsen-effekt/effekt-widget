const gulp = require('gulp')
const sass = require('gulp-sass')
const watch = require('gulp-watch')

gulp.task('default', function() {
    gulp.src('style/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('style/'))
})

gulp.task('watch', function() {
    gulp.watch('style/**/*.scss', ['default'])
})