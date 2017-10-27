var del = require('del');
var gulp = require('gulp');
var git = require('gulp-git');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var rename = require('gulp-rename');

var gitHash;
git.revParse({args:'--short HEAD'}, function (err, hash) {
    console.log('current git hash: ' + hash);
    gitHash = hash;
});

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('sass', function() {
    return gulp.src('app/scss/style.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('app/css'))
});

gulp.task('gitJS', ['clean'], function() {
   return gulp.src('app/script.js')
       .pipe(rename('script-' + gitHash + '.js'))
       .pipe(gulp.dest('dist'))
});

gulp.task('inject', ['gitJS'], function() {
    return gulp.src('app/index.html')
        .pipe(inject(gulp.src('dist/script-*.js', {read: false}), {relative: true, ignorePath: 'dist'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'sass', 'gitJS', 'inject'], function() {
    return gulp.src(['app/**/*.*', '!app/index.html', '!app/script.js'])
        .pipe(gulp.dest('dist'))
});