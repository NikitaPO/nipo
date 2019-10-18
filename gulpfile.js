const autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  browserSync = require('browser-sync'),
  cleanCSS = require('gulp-clean-css'),
  del = require('del'),
  concat = require('gulp-concat'),
  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  scss = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

gulp.task('del', async function() {
  del.sync('dist');
});

gulp.task('scss', function() {
  return gulp.src('app/scss/**/style.scss')
    .pipe(plumber())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(scss({
      outputStyle: 'compressed'
    }).on('error', scss.logError))
    .pipe(autoprefixer({
      overRideBrowsers: ['last 10 versions'],
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('css-libs', function() {
  return gulp.src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/animate.css/animate.min.css',
      'node_modules/magnific-popup/dist/magnific-popup.css',
      'node_modules/slick-carousel/slick/slick.css',
      'app/libs/font-awesome/all.min.css'
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js', function() {
  return gulp.src([
      'node_modules/slick-carousel/slick/slick.min.js',
      'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
      'app/js/index.js'
    ])
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
});

gulp.task('export', async function() {
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'))

  let buildCSS = gulp.src('app/css/**/*.min.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))

  let buildJS = gulp.src('app/js/**/*.min.js')
    .pipe(gulp.dest('dist/js'))

  let buildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'))

  let buildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'))

  let buildVideo = gulp.src('app/video/**/*.*')
    .pipe(gulp.dest('dist/video'))

  let buildLibs = gulp.src('app/libs/**/*.*')
    .pipe(gulp.dest('dist/libs'))
});

gulp.task('build', gulp.series('del', 'export'));

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/**/*.html', gulp.parallel('html'));
  gulp.watch('app/js/index.js', gulp.parallel('js'))
});

gulp.task('default', gulp.parallel('css-libs', 'scss', 'js', 'html', 'browser-sync', 'watch'));
