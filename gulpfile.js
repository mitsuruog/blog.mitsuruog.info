var gulp = require('gulp');
var textlint = require('gulp-textlint');

gulp.task('textlint', function() {
  return gulp.src('./source/**/*.md')
    .pipe(textlint());
});

gulp.task('watch', function() {
  gulp.watch('./source/**/*.md', ['textlint']);
})

gulp.task('default', ['textlint', 'watch']);
