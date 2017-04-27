var gulp = require('gulp'),
    connect = require('gulp-connect'),
    jade = require('gulp-jade'),

    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),

    browserify = require('browserify'),
    babelify = require('babelify');
minify = require('gulp-minify'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    concat = require('gulp-concat'),

    notify = require('gulp-notify'),
    fs = require('fs');

gulp.task('connect', function () {
    connect.server({
        root: ['./'],
        port: 4000,
        livereload: true
    })
});

gulp.task('jade', function () {
    return gulp.src('./dev/jade/index.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'))
        .pipe(notify('компиляция jade ...'))
        .pipe(connect.reload());
});

gulp.task('styles', function () {
    var processors = [
        autoprefixer({browsers: ['last 2 versions']})
    ];

    return gulp.src('./dev/styles/main.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./assets/css/main.css'))
        .pipe(notify('компиляция scss ...'))
        .pipe(connect.reload());
});

gulp.task('scripts', function () {
    browserify('./dev/js/app.js', {entries: './dev/js/app.js', debug: true})
        .transform(babelify, {
            presets: ['es2015'],
            plugins: ['transform-class-properties']
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(jshint())
        .pipe(gulp.dest('./assets/js/'))
        .pipe(notify('Скрипты ...'))
        .pipe(connect.reload())
});

gulp.task('images', function () {
    return gulp.src('./dev/images/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant(), jpegtran()]
        }))
        .pipe(gulp.dest('./assets/images'))
});

gulp.task('default', ['connect', 'styles', 'scripts', 'jade'], function () {
    gulp.watch('./dev/jade/**/*.jade', ['jade']);
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./dev/js/**/*.js', ['scripts']);
});
