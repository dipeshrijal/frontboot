var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var fontAwesome = require('node-font-awesome');

var config = {
    bootstrapDir: './node_modules/bootstrap-sass',
    publicDir: './public',
    nodePath: './node_modules'
};

gulp.task('sass', function () {
    return gulp.src('./assets/scss/*.scss').pipe(sass({
        includePaths: [
            config.bootstrapDir + '/assets/stylesheets',
            fontAwesome.scssPath
        ]
    }))
        .pipe(concat('app.css'))
        .pipe(minify())
        .on('error', onError)
        .pipe(gulp.dest(config.publicDir + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('fonts', function () {
    return gulp.src([
        config.bootstrapDir + '/assets/fonts/**/*',
        fontAwesome.fonts
    ])
        .pipe(gulp.dest(config.publicDir + '/fonts'));
});

gulp.task('copy', function () {
    return gulp.src([
        config.nodePath + '/jquery/dist/jquery.min.js',
        config.bootstrapDir + '/assets/javascripts/bootstrap.min.js'
    ])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.publicDir + '/js'));
});

gulp.task('watch', function () {
    gulp.watch('./assets/scss/*.scss', ['sass']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('**/*.html', browserSync.reload);
    gulp.watch('./assets/**/*.js', browserSync.reload);
});

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        open: 'external',
        host: 'frontboot.app',
        proxy: 'frontboot.app' // or project.dev/app/
    })
});

gulp.task('default', ['sass', 'fonts', 'copy', 'watch', 'browserSync']);

function onError(err) {
    console.log(err);
    this.emit('end');
}