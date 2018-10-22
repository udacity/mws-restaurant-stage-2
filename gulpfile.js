const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');

gulp.task("default", function() {
  // code for your default task goes here
  console.log("gulp file started");
  // gulp.watch('src/css/*.css', ['styles']);
  gulp.watch('js/**/*.js', ['scripts']);
  gulp.watch('./*.html').on('change', browserSync.reload);

});

// gulp.task("styles", function() {
//   gulp
//   	.src('src/app.css')
//     .pipe(
//       autoprefixer({
//         browsers: ["last 2 versions"]
//       })
//     )
//     .pipe(gulp.dest("./css"));
//     .pipe(browserSync.stream());
// });

gulp.task("scripts", function(){
  gulp
    .src('js/idb.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist'));
})