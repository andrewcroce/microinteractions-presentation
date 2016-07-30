const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const browser = require('browser-sync');
const rimraf = require('rimraf');
const sequence = require('run-sequence');
const sass = require('gulp-sass');
const fs = require('fs');
const slug = require('slug');
const slideManifest = require('./src/slideManifest.json');

// Port on which the dev server will run
const PORT = 8000;


// Assets to copy
const ASSET_PATHS = [
  './src/img/**/*',
  './src/js/reveal.js/**/*',
  './src/js/custom_plugins/**/*',
  './src/fonts/**/*'
];

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
const nunjucksEnv = environment => {
  environment.addFilter('is_string', obj => isString(obj));
  environment.addFilter('is_array', obj => isArray(obj));
  environment.addFilter('slugify', string => slugify(string));
};


// `gulp clean`
// Clean the build directory
gulp.task('clean', done => {
  rimraf('build', done);
});


// `gulp assets`
// Copy various assets to the build directory
gulp.task('assets', () => {
  gulp.src(ASSET_PATHS, {
    base: 'src'
  })
  .pipe(gulp.dest('./build'));
});


// `gulp templates`
// Compile Nunjucks index template
gulp.task('templates', () => {
  gulp.src('./src/index.njk')
    .pipe(nunjucks({
      path: ['src'],
      data: {
        slides: slideManifest
      },
      manageEnv: nunjucksEnv
    }))
    .pipe(gulp.dest('./build'))
    .pipe(browser.stream());
});


// `gulp slides`
// Generate HTML files for slides named in the slideManifest.json
gulp.task('slides', () => {
  const writeSlideFile = (name, label) => {
    fs.writeFile(`./src/slides/${name}.html`, `<section title="${label}">\n\n</section>`);
    console.log(`Created slide: ${name}.html`);
  };
  slideManifest.forEach(slide => {

    if(isString(slide)) {
      const name = slugify(slide);
      if(fileDoesntExist(`./src/slides/${name}.html`)) {
        writeSlideFile(name,slide);
      }
    } else if (isArray(slide)) {
      slide.forEach(childSlide => {
        const name = slugify(childSlide);
        if(fileDoesntExist(`./src/slides/${name}.html`)) {
          writeSlideFile(name,childSlide);
        }
      });
    }
  });
});


// `gulp scss`
// Compile SCSS
gulp.task('scss', () => {
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
gulp.task('javascript', () => {
  return browserify({
    entries: ['./src/js/app.js'],
    paths: ['./node_modules','./src/js/']
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js'))
  .pipe(browser.stream());
});


// `gulp build`
// Build the whole thing
gulp.task('build', done => {
  sequence('clean', ['slides', 'templates', 'scss', 'javascript', 'assets'], done);
});


// `gulp server`
// Run a development server
gulp.task('server', ['build'], () => {
  browser.init({
    server: './build', port: PORT
  });
});


// `gulp`
// Watch for changes, and do all the things
gulp.task('default', ['server'], () => {
  gulp.watch(['src/img','src/img/**/*','src/fonts','src/fonts/**/*'], ['assets', browser.reload]);
  gulp.watch(['src/js/**/*.js'], ['javascript']);
  gulp.watch(['src/scss/**/*.scss'], ['scss']);
  gulp.watch(['src/slides/**/*.html','src/**/*.njk'], ['templates']);
  gulp.watch(['src/slideManifest.json'], ['slides', 'templates', browser.reload]);
});
