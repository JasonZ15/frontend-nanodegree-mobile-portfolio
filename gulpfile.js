var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat');
    path = require('path');
    minifyCSS = require('gulp-minify-css');

var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle,
    cssMap;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
  cssMap = true;
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
  cssMap = false;
}

jsSources = ['components/scripts/*.js'];
sassSources = ['components/sass/*.js'];
htmlSources = [outputDir + '*.html'];

gulp.task('js', function() { //called by initial build and also by watch
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest('builds/development/' + 'js'))
    .pipe(connect.reload());
});

gulp.task('compass', function() { //called by initial build and also by watch
  gulp.src(sassSources)
    .pipe(compass({
      sourcemap: cssMap,
      sass: 'components/sass',
      css: 'builds/development/' + 'css',
      image: 'builds/development/' + 'images',
      style: sassStyle,
      require: ['susy', 'breakpoint']
    })
    .on('error', gutil.log))
//    .pipe(gulp.dest( outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['compass']);
  gulp.watch('builds/development/**/*.html', ['html']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() { //called by initial build and also by watch
  gulp.src('builds/development/**/*.html') // smart paths. it moves directeries and files under outputDir
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

// Compress and move css, js and images from development to production
gulp.task('move', function() {
  gulp.src('builds/development/**/*.css')
  .pipe(gulpif(env === 'production', minifyCSS()))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)));

  gulp.src('builds/development/**/*.js')
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)));

  gulp.src('builds/development/img/**/*.*')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'img')));
  gulp.src('builds/development/views/images/**/*.*')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'views/images')));
  gulp.src('builds/development/*.ico')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)));
});

gulp.task('default', ['watch', 'html', 'js', 'compass', 'move', 'connect']);
