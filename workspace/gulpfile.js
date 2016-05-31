'use strict';

var path = require('path');
var gulp = require('gulp');
var assemble = require('assemble');
var i18n = require('gulp-html-i18n');
var app = assemble();

app.data({site: {title: 'Test'}});
app.option('layout', 'default.hbs');

gulp.task('load', function(cb) {
  app.layouts('src/templates/layouts/*.hbs');
  app.partials('src/templates/partials/*.hbs');
  app.pages('src/templates/pages/*.hbs');
  cb();
});

gulp.task('assemble', ['load'], function() {
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(app.dest(function(file) {
      file.extname = '.html';
      file.path = file.basename;
      return 'dist/raw';
    }));
});

gulp.task('i18n', ['assemble'], function(){
  var dest  = './dist';
  var index = './dist/raw/*.html';

  return gulp.src(index)
    .pipe(i18n({
      langDir: './src/i18n',
      trace: false,
      createLangDirs: true,
      langRegExp: /\[\[ ?([\w-.]+) ?\]\]/g
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('default', ['i18n']);
