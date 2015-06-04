var path = require('path');

var autoprefixer = require('gulp-autoprefixer');
var babelify = require('babelify');
var browserify = require('browserify');
var concat = require('gulp-concat');
var envify = require('envify/custom');
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var reactify = require('reactify');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var vinylBuffer = require('vinyl-buffer');
var vinylSource = require('vinyl-source-stream');
var watchify = require('watchify');
var webserver = require('gulp-webserver');


var ROOT = './src/';
var JS = path.resolve(ROOT, 'js');
var CSS = path.resolve(ROOT, 'css');

var browserifyArgs = watchify.args;
browserifyArgs.debug = process.NODE_ENV !== 'production';
var bundler = browserify(path.resolve(JS, 'app.js'), browserifyArgs)
    .transform(babelify.configure({
        optional: ['es7.asyncFunctions', 'runtime']
    }))
    .transform(envify({
        MKT_API_ROOT: process.env.MKT_API_ROOT ||
                      'https://marketplace-dev.allizom.org/',
        MKT_MEDIA_ROOT: process.env.MKT_MEDIA_ROOT ||
                        'https://marketplace.cdn.mozilla.net/media/',
    }))
    .transform(reactify);


gulp.task('css', function() {
    gulp.src([path.resolve(CSS, '*.styl'), path.resolve(CSS, 'lib/*.css')])
        .pipe(stylus({compress: true}))
        .pipe(autoprefixer())
        .pipe(concat('bundle.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('build'));
});


function jsBundle(bundler) {
    var bundle = bundler
        .bundle()
        .pipe(vinylSource('bundle.js'))
        .pipe(vinylBuffer());

    if (process.env.NODE_ENV == 'production') {
        bundle = bundle.pipe(uglify());
    }

    return bundle.pipe(gulp.dest('build'));
}


gulp.task('js', function() {
    return jsBundle(bundler);
});


gulp.task('serve', function() {
    return gulp.src(['./'])
        .pipe(webserver({
            fallback: 'index.html',
            port: process.env.MKT_CLIENT_PORT || '8680'
        }));
});

gulp.task('watch', function() {
    bundler = watchify(bundler);

    bundler.on('update', function() {
        jsBundle(bundler);
    });
    bundler.on('log', console.log);

    gulp.watch(path.resolve(CSS, '**/*.styl'), ['css']);
});


gulp.task('build', ['css', 'js']);
gulp.task('default', ['css', 'js', 'serve', 'watch']);
