var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var assemble = require('assemble');
var renderFile = require('assemble-render-file');
var plumber = require('gulp-plumber');
var debug = require('gulp-debug');


var app = assemble();

app.option('layout', 'default.hbs');
// var app = assemble({
//       layout: 'default.hbs',
//       layoutdir: './src/templates/layouts/',
//       partials: './src/templates/partials/**/*.hbs'
//     })
//     .use(renderfile());




gulp.task('serve', ['sass', 'assemble'], function() {

    browserSync.init({
        server: {
          baseDir: "./dist/"
        }
    });

    gulp.watch("./src/sass/**/*.scss", ['sass']);
    gulp.watch("./src/templates/**/*.hbs", ['assemble']);
    gulp.watch("./js/**/*.js").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('load', function(cb) {
  app.layouts('src/templates/layouts/**/*.hbs');
  app.partials('src/templates/partials/**/*.hbs');
  app.pages('src/templates/pages/**/*.hbs')
  cb();
});

gulp.task('assemble', ['load'], function() {
  app.partials('src/templates/partials/**/*.hbs');
  app.layouts('src/templates/layouts/**/*.hbs');
  app.pages('src/templates/pages/**/*.hbs');

  return app.toStream('pages')
      .pipe(plumber(function(err){
        console.log(err);
      }))
      .pipe(debug())
      .pipe(app.renderFile())
      .pipe(app.dest('dist'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
