var gulp = require('gulp');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var paths = {
  styles: {
    src: 'src/css/**/*.css',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  images: {
    src: 'src/img/**/*.jpg',
    dest: 'dist/img/'
  }
};

// add tasks from incumbent Gruntfile
require('gulp-grunt')(gulp, {
  prefix: 'stage-1-'
});

gulp.task('default', [
  'stage-1-default'
]);

// utility. Delete previous build
function clean() {
  return del(['dist']);
}

// copy CSS to /dist/css
function styles() {
  return (gulp.src(paths.styles.src))
    .pipe(gulp.dest(paths.styles.dest));
}

// transpile JS; copy to /dist/js
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
}
// copy HTML to /dist
function html() {
  return (gulp.src(paths.html.src))
    .pipe(gulp.dest(paths.html.dest));
}

// compress images, then copy /img to /dist
function images() {
  return (gulp.src(paths.images.src))
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.jpegtran({
        progressive: true
      })
    ], {
      verbose: true
    }))
    .pipe(gulp.dest(paths.images.dest));
}

// compress and copy other assets to /dist
function assets() {
  let files = [
    'src/manifest.json',
    'src/favicon*.*',
    'src/icons*.*',
    'src/sw.js'
  ];
  return (gulp.src(files, {
      base: 'src/'
    }))
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 5
      })
    ], {
      verbose: true
    }))
    .pipe(gulp.dest(paths.html.dest));
}

// Run all the Gulp tasks at once.
function build() {
  clean();
  html();
  styles();
  scripts();
  images();
  assets();
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.assets = assets;
exports.build = build;
