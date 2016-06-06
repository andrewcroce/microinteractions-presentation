var gulp        = require('gulp');
var jade        = require('gulp-jade');
var sass        = require('gulp-sass');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var browser     = require('browser-sync');
var rimraf      = require('rimraf');
var sequence    = require('run-sequence');
var slides      = require('./src/slides.json');

var PORT = 8000;


gulp.task('clean', function(done) {
  rimraf('build', done);
});


gulp.task('images', function() {
  gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./build/img'));
});


gulp.task('slides', function(){
  gulp.src('./src/index.jade')
    .pipe(jade({
      locals: {
        slides: slides
      }
    }))
    .pipe(gulp.dest('./build'))
});


gulp.task('scss', function(){
  gulp.src('./src/scss/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'))
});


gulp.task('javascript', function(){
  return browserify('./src/js/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});


gulp.task('build', function(done) {
  sequence('clean', ['slides', 'scss', 'javascript', 'images'], done);
});


gulp.task('server', ['build'], function(){
  browser.init({
    server: 'build', port: PORT
  });
});


gulp.task('default', ['build', 'server'], function(){
  gulp.watch(['src/js/**/*.js'], ['javascript', browser.reload]);
  gulp.watch(['src/scss/**/*.scss'], ['scss', browser.reload]);
  gulp.watch(['src/**/*.jade'], ['slides', browser.reload]);
  gulp.watch(['src/slides.json'], ['slides', browser.reload]);
});
