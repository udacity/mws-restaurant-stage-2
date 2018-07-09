var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var useref = require('gulp-useref');
var del = require('del');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
// var gutil = require('gulp-util');
// var browserSync = require('browser-sync').create();
// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var webpackConfig = require('./webpack.config.js');
// var stream = require('webpack-stream');
 
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
] );

// utility
function clean() {
  return del(['dist']);
}

// concatentate CSS; copy to /dist/css; TODO: minify
function styles() {
  return (gulp.src(paths.styles.src))
  .pipe(concat('all.min.css'))
  .pipe(gulp.dest(paths.styles.dest));
}

// transpile JS; concatentate; minify; copy to /dist/js
function scripts() {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.scripts.dest));
}
// copy HTML to /dist; change script and CSS links
function html() {
  return (gulp.src(paths.html.src))
  .pipe(useref())
  .pipe(gulp.dest(paths.html.dest));
}

// compress images; copy /img to /dist
function images() {
  return (gulp.src(paths.images.src))
  .pipe(imagemin([
      imagemin.jpegtran({ progressive: true })
  ]))
  .pipe(gulp.dest(paths.images.dest));
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;


gulp.task('useref', () => {
  return gulp.src(paths.html.src)
  .pipe(useref())
  .pipe(uglify())
  .pipe(gulp.dest(paths.html.dest))
});


gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  });
});

gulp.task('watch', ['browserSync'], () => {
  gulp.watch('src/js/**/*.js', browserSync.reload);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/css/**/*.css', browserSync.reload);
});

gulp.task('webpack', [], () => {
  return gulp.src(path.ALL)
    .pipe(sourcemaps.init())
    .pipe(stream(webpackConfig))
    .pipe(uglify()) // minification
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.DEST_BUILD))
});