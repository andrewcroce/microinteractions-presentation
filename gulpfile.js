var gulp          = require('gulp');
var nunjucks      = require('gulp-nunjucks-render');
var browserify    = require('browserify');
var source        = require('vinyl-source-stream');
var browser       = require('browser-sync');
var rimraf        = require('rimraf');
var sequence      = require('run-sequence');
var sass          = require('gulp-sass');
var fs            = require('fs');
var slug          = require('slug');


// Port on which the dev server will run
var PORT = 8000;


// Assets to copy
var ASSET_PATHS = [
  './src/img/**/*',
  './src/js/reveal.js/**/*',
  './src/js/custom_plugins/**/*',
  './src/fonts/**/*'
];

function slideManifest() {
  return JSON.parse(fs.readFileSync('./src/slideManifest.json'));
}

// Utility function to check if an object is a string
function isString(obj) {
  return Object.prototype.toString.call(obj) == '[object String]';
}

// Utility function to check if an object is an array
function isArray(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
}

function slugify(string) {
  return slug(string, {lower: true});
}
// Utility function to check if a file exists
function fileDoesntExist(path) {
  try {
    fs.statSync(path);
    return false;
  } catch(error) {
    return true;
  }
}


// Custom Nunjucks environment
// Adds filters to check if an object is a string or an array
var nunjucksEnv = function(environment) {
  environment.addFilter('is_string', function(obj) {
    return isString(obj);
  });
  environment.addFilter('is_array', function(obj) {
    return isArray(obj);
  });
  environment.addFilter('slugify', function(string) {
    return slugify(string);
  });
}


// `gulp clean`
// Clean the build directory
gulp.task('clean', function(done) {
  rimraf('build', done);
});


// `gulp assets`
// Copy various assets to the build directory
gulp.task('assets', function() {
  gulp.src(ASSET_PATHS, {
    base: 'src'
  })
  .pipe(gulp.dest('./build'));
});


// `gulp templates`
// Compile Nunjucks index template
gulp.task('templates', function(){
  gulp.src('./src/index.njk')
    .pipe(nunjucks({
      path: ['src'],
      data: {
        slides: slideManifest()
      },
      manageEnv: nunjucksEnv
    }))
    .pipe(gulp.dest('./build'))
    .pipe(browser.stream());
});


// `gulp slides`
// Generate HTML files for slides named in the slideManifest.json
gulp.task('slides', function(){
  var writeSlideFile = function(name,label){
    fs.writeFile('./src/slides/'+name+'.html', '<section title="'+label+'">\n\n</section>');
    console.log('Created slide: '+name+'.html');
  };
  slideManifest().forEach(function(slide) {

    if(isString(slide)) {
      var name = slugify(slide);
      if(fileDoesntExist('./src/slides/'+name+'.html')) {
        writeSlideFile(name,slide);
      }
    } else if (isArray(slide)) {
      slide.forEach(function(childSlide) {
        var name = slugify(childSlide);
        if(fileDoesntExist('./src/slides/'+name+'.html')) {
          writeSlideFile(name,childSlide);
        }
      });
    }
  });
});


// `gulp scss`
// Compile SCSS
gulp.task('scss', function() {
  gulp.src('./src/scss/app.scss')
    .pipe(sass({
      includePaths: [
        'node_modules',
        'src/js/reveal.js/css'
      ]
    }).on('error', sass.logError))
    .pipe(gulp.dest('./build/css'))
    .pipe(browser.stream());
});


// `gulp javascript`
// Bundle Javascript
gulp.task('javascript', function() {
  return browserify({
    entries: ['./src/js/app.js'],
    paths: ['./node_modules','./src/js/']
  })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});


// `gulp build`
// Build the whole thing
gulp.task('build', function(done) {
  sequence('clean', ['slides', 'templates', 'scss', 'javascript', 'assets'], done);
});


// `gulp server`
// Run a development server
gulp.task('server', ['build'], function() {
  browser.init({
    server: './build', port: PORT
  });
});


// `gulp`
// Watch for changes, and do all the things
gulp.task('default', ['build', 'server'], function() {
  gulp.watch(['src/img','src/img/**/*','src/fonts','src/fonts/**/*'], ['assets', browser.reload]);
  gulp.watch(['src/js/**/*.js'], ['javascript', 'assets', browser.reload]);
  gulp.watch(['src/scss/**/*.scss'], ['scss']);
  gulp.watch(['src/**/*.html','src/**/*.njk'], ['templates']);
  gulp.watch(['src/slideManifest.json'], ['slides', 'templates', browser.reload]);
});
