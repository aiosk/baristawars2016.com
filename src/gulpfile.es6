import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from "gulp-rename";
import filter from 'gulp-filter';
const browserSync = require('browser-sync').create();
const {reload} = browserSync;


const babelOpts = {presets: ['es2015'], compact: false};

gulp.task('webHtml', () => {
    const pugOpts = {
        data: {},
        pretty: true,
        compileDebug: true
    };
    gulp.src('./src/html/**/*.pug')
        .pipe(filter(file => !/\/_/.test(file.path) && !/^_/.test(file.relative)))
        .pipe(plumber())
        .pipe(pug(pugOpts))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('webCss', () => {
    const sassOpts = {
        includePaths: [
            'node_modules/foundation-sites/scss',
            'node_modules/sass-bem/'
        ],
        outputStyle: 'nested'
    };

    gulp.src(`./src/css/main.scss`)
        .pipe(sass(sassOpts).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['ff >= 4', 'Chrome >= 19', 'ie >= 9'], cascade: false}))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
});

gulp.task('webJs', () => {

    gulp.src('./src/js/**/*.es6')
        .pipe(plumber())
        .pipe(babel(babelOpts))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('normalize', () => {
    const sassNormalizeOpts = {includePaths: ['node_modules/foundation-sites/scss']};
    //outputStyle: 'compressed'
    gulp.src("./src/css/normalize.scss")
        .pipe(sass(sassNormalizeOpts).on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({basename: 'normalize.min'}))
        .pipe(gulp.dest(`./dist/css/`))
});

gulp.task('project', () => {
    return gulp.src('./src/*.es6')
        .pipe(plumber())
        .pipe(babel(babelOpts))
        .pipe(gulp.dest('./'))
});

gulp.task('default', () => {
    const browserSyncOpts = {
        server: 'dist/',
        port: 8500,
        ui: {
            port: 8501
        },
        open: false
    };
    browserSync.init(browserSyncOpts);

    gulp.watch('./src/*.es6', ['project']);
    gulp.watch('./src/css/normalize.scss', ['normalize']);
    gulp.watch('./src/css/**/*.scss', ['webCss']);

    gulp.watch('./src/html/**/*.pug', ['webHtml']);
    gulp.watch('./src/js/**/*.es6', ['webJs']);

    // gulp.watch(['./src/libs/**/*.coffee', './src/api/**/*.coffee'], ['api']);
});