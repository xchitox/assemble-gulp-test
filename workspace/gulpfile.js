var path = require('path');
var gulp = require('gulp');
var assemble = require('assemble');
var app = assemble();

app.data({site: {title: 'HKA'}});
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
      return 'dist';
    }));
});

gulp.task('default', ['assemble']);
