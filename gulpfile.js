var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require("gulp-notify"),
  htmlmin = require('gulp-htmlmin');

// Скрипты проекта

gulp.task('main-js', function () {
  return gulp.src([
    'app/js/main.js',
  ])
    .pipe(concat('main.min.js'))
    // .pipe(uglify()) // Минифицирует js
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('libs-js', function () {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/remodal/dist/remodal.min.js',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
    'node_modules/owl.carousel/dist/owl.carousel.min.js',
    'node_modules/jquery.maskedinput/src/jquery.maskedinput.js',
    'node_modules/slick-carousel/slick/slick.min.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify()) // Минимизировать весь js (на выбор)
    .pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  });
});

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.+(sass|scss)')
    .pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(autoprefixer(['last 20 versions']))
    // .pipe(cleanCSS()) // Опционально, закомментировать при отладке
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['sass', 'libs-js', 'main-js', 'browser-sync'], function () {
  gulp.watch('app/sass/**/*.+(sass|scss)', ['sass']);
  gulp.watch('app/js/main.js', ['main-js']);
  gulp.watch(['app/*.html'], browserSync.reload);
});

gulp.task('imagemin', function () {
  return gulp.src('app/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'libs-js', 'main-js'], function () {

  var buildFiles = gulp.src([
    'app/*.html',
    'app/*.php',
    'app/*.txt',
    'app/.htaccess'
  ]).pipe(gulp.dest('dist'));

  var buildVideos = gulp.src([
    'app/videos/*'
  ]).pipe(gulp.dest('dist/videos'));

  var buildFilesFold = gulp.src([
    'app/files/*'
  ]).pipe(gulp.dest('dist/files'));

  var buildCss = gulp.src([
    'app/css/libs.min.css',
    'app/css/main.min.css'
  ]).pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src([
    'app/js/libs.min.js',
    'app/js/main.min.js',
  ]).pipe(gulp.dest('dist/js'));

  var buildFonts = gulp.src([
    'app/fonts/**/*',
  ]).pipe(gulp.dest('dist/fonts'));

  var buildAdmin = gulp.src([
    'app/admin/*',
    'app/admin/.htaccess'
  ]).pipe(gulp.dest('dist/admin'));

});

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('default', ['watch']);
gulp.task('removedist', function () { return del.sync('dist'); });
