var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var useref = require('gulp-useref');
var del = require('del');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
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
// TODO: fix error in all.min.js, when restaurant ID is absent
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
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.jpegtran({ progressive: true })
    ], {
      verbose: true
    }   
    ))
    .pipe(gulp.dest(paths.images.dest));
}

// compress and copy other assets to /dist
function assets() {
  let files = [
    'src/manifest.json',
    'src/favicon*.*',
    'src/icons*.*'
  ];
  return (gulp.src(files, { base: 'src/'}))
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 5 })
    ], {
      verbose: true
    } 
    ))
    .pipe(gulp.dest(paths.html.dest));
}

// TODO: make this work. The individual tasks are fine.
function build() {
  return gulp.src(paths.html.src)
  .pipe(clean)
  .pipe(styles)
  .pipe(scripts)
  .pipe(html)
  .pipe(images)
  .pipe(assets)
  .pipe(gulp.dest(paths.html.dest));
}

// Change paths to scripts in HTML files
gulp.task('useref', () => {
  return gulp.src(paths.html.src)
    .pipe(useref())
    .pipe(uglify())
    .pipe(gulp.dest(paths.html.dest));
});

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.assets = assets;
exports.build = build;
