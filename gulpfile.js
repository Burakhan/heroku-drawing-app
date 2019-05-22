var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  return gulp.src(
    [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'public/src/*.js'
    ])
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('public'))
  .pipe(rename('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
  gulp.watch('public/src/*.js', gulp.series('scripts'));
});