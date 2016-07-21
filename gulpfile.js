var gulp = require('gulp');
var browserify = require('browserify');
var fs = require('fs');
var watch = require('gulp-watch');


gulp.task('scripts', function() {
  return browserify('./src/main.js')
    .transform('babelify', { presets: ['es2015']})
    .bundle()
    .pipe(fs.createWriteStream('resources/main.js'))
});

gulp.task('dev', ['scripts'], function() {
  watch('src/*', function() {
    gulp.start('scripts')
  })
});