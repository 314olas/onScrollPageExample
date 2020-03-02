'use strict';

const gulp  = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autopreffixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-imagemin');


const options = {
  default_js_file:'index.js',
  scripts:{
    src: './src/js/',
    dest:'./dist/js',
    watch: './src/js/**/*.js',
  },
  styles:{
    src: './src/sass/**/*.scss',
    dest:'./dist/css',
    watch: './src/sass/**/*.scss'
  },
  images: {
    src: './dist/images/**/',
    dest: './dist/images/',
    watch: './dist/images/**/*'
  }
};

gulp.task('watch', () => {

  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  gulp.watch(options.scripts.watch, ['js']);
  gulp.watch(options.default_js_file, ['js']);
  gulp.watch(options.styles.watch, ['sass']);
  gulp.watch(options.images.watch, ['minimages']);
  gulp.watch("dist/**.html").on('change', browserSync.reload);
});

gulp.task('sass', () => {
  return gulp.src(options.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autopreffixer({
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.styles.dest))
    .pipe(browserSync.stream());
});

gulp.task('mincss', ['sass'], () => {
  return gulp.src("dist/css/**fancybox.css")
    .pipe(rename({suffix: ".min"}))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/css"));
});

gulp.task('js', () => {
  return browserify({
    extensions: ['.js'],
    entries: [options.default_js_file],
    debug: true
  })
    .transform('babelify', {
      presets: ['@babel/preset-env']
    })
    .bundle()
    .pipe(source(options.scripts.src))
    .pipe(buffer())
    .pipe(rename({
      dirname: "",
      basename: "index",
      suffix: ".js"

    }))
    .pipe(gulp.dest(options.scripts.dest))
    .pipe(browserSync.stream());
});

gulp.task('minimages', () => {
  return gulp.src(options.images.src)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(options.images.dest))
});

gulp.task('dev', ['js', 'sass', 'watch']);
gulp.task('prod', ['js', 'sass', 'mincss', 'minimages']);

