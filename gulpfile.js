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

// Port on which the dev server will run
const PORT = 8000;

// Slide manifest file
const MANIFEST = './src/slideManifest.json';

// Assets to copy
const ASSET_PATHS = [
  './src/img/**/*',
  './src/js/reveal.js/**/*',
  './src/js/custom_plugins/**/*',
  './src/fonts/**/*'
];


const onError = (err) => console.error(err.message);
const slugify = (name) => slug(name, {lower: true});
const flatten = (ary) => Array.prototype.concat.apply([], ary);
const slideManifest = () => JSON.parse(fs.readFileSync(MANIFEST));

const structuredSlides = () => {
  const toSlide = (title) => ({
    title,
    partial: `slides/${slugify(title)}.html`
  });

  return slideManifest().map(slide => {
    if (Array.isArray(slide)) {
      return {children: slide.map(toSlide)};
    } else {
      return toSlide(slide);
    }
  });
}

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
        slides: structuredSlides()
      }
    }))
    .on('error', onError)
    .pipe(gulp.dest('./build'))
    .pipe(browser.stream())
});


// `gulp slides`
// Generate HTML files for slides named in the slideManifest.json
gulp.task('slides', () => {
  flatten(slideManifest()).forEach(title => {
    const slug = slugify(title);
    const filename = `./src/slides/${slug}.html`;
    const content = `<section title="${title}">\n\n</section>`;

    fs.writeFile(filename, content, {flag: 'wx'}, err => {
      if (!err) console.log(`Created slide: ${slug}.html`);
    });
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
    server: './build',
    port: PORT
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
