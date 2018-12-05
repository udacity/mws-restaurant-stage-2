var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var terser = require('gulp-terser');


gulp.task('default',['styles'],function(){
	gulp.watch('./css/*.css').on('change', browserSync.reload);
	gulp.watch('./js/*.js').on('change', browserSync.reload);
	gulp.watch('./*.html').on('change', browserSync.reload);
	browserSync.init({
		server: './'
	});
})

gulp.task('styles', function(){
    gulp.src('css/**/*.css')
	    .pipe(concat('styles.css'))
	    .pipe(cleanCSS())
	    .pipe(autoprefixer('last 2 versions'))
	    .pipe(gulp.dest('css'))
});

gulp.task('scripts', function() {
	gulp.src('js/**/*.js')
	.pipe(terser())
		// .pipe(concat('all.js'))
		.pipe(gulp.dest('js'));
});