'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _gulpSass = require('gulp-sass');

var _gulpSass2 = _interopRequireDefault(_gulpSass);

var _gulpPug = require('gulp-pug');

var _gulpPug2 = _interopRequireDefault(_gulpPug);

var _gulpPlumber = require('gulp-plumber');

var _gulpPlumber2 = _interopRequireDefault(_gulpPlumber);

var _gulpAutoprefixer = require('gulp-autoprefixer');

var _gulpAutoprefixer2 = _interopRequireDefault(_gulpAutoprefixer);

var _gulpCleanCss = require('gulp-clean-css');

var _gulpCleanCss2 = _interopRequireDefault(_gulpCleanCss);

var _gulpRename = require('gulp-rename');

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _gulpFilter = require('gulp-filter');

var _gulpFilter2 = _interopRequireDefault(_gulpFilter);

var _gulpUglify = require('gulp-uglify');

var _gulpUglify2 = _interopRequireDefault(_gulpUglify);

var _gulpIf = require('gulp-if');

var _gulpIf2 = _interopRequireDefault(_gulpIf);

var _gulpConcat = require('gulp-concat');

var _gulpConcat2 = _interopRequireDefault(_gulpConcat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


var babelOpts = { presets: ['es2015'], compact: false };
var isProduction = false; 

_gulp2.default.task('webHtml', function () {
    var pugOpts = {
        data: {},
        pretty: !isProduction,
        compileDebug: true
    };
    _gulp2.default.src('./src/html/**/*.pug').pipe((0, _gulpFilter2.default)(function (file) {
        return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    })).pipe((0, _gulpPlumber2.default)()).pipe((0, _gulpPug2.default)(pugOpts)).pipe(_gulp2.default.dest('./dist/')).pipe(browserSync.stream());
});

_gulp2.default.task('webCss', function () {
    var sassOpts = {
        // includePaths: [
        //     'node_modules/foundation-sites/scss',
        //     'node_modules/materialize-css/sass/',
        //     'node_modules/sass-bem/'
        // ],
        outputStyle: 'nested'
    };

    _gulp2.default.src('./src/css/main.scss').pipe((0, _gulpSass2.default)(sassOpts).on('error', _gulpSass2.default.logError)).pipe((0, _gulpAutoprefixer2.default)({ browsers: ['ff >= 4', 'Chrome >= 19', 'ie >= 9'], cascade: false })).pipe((0, _gulpIf2.default)(isProduction, (0, _gulpCleanCss2.default)())).pipe(_gulp2.default.dest('./dist/css/')).pipe(browserSync.stream());
});

_gulp2.default.task('webJs', function () {
    _gulp2.default.src('./src/js/**/*.es6').pipe((0, _gulpPlumber2.default)()).pipe((0, _gulpConcat2.default)('main.es6')).pipe((0, _gulpBabel2.default)(babelOpts)).pipe((0, _gulpIf2.default)(isProduction, (0, _gulpUglify2.default)())).pipe(_gulp2.default.dest('./dist/js/')).pipe(browserSync.stream());
});

_gulp2.default.task('project', function () {
    _gulp2.default.src('./src/*.es6').pipe((0, _gulpPlumber2.default)()).pipe((0, _gulpBabel2.default)(babelOpts)).pipe(_gulp2.default.dest('./'));
});

_gulp2.default.task('default', function () {
    var browserSyncOpts = {
        server: 'dist/',
        port: 8500,
        ui: {
            port: 8501
        },
        open: false
    };
    browserSync.init(browserSyncOpts);

    _gulp2.default.watch('./src/*.es6', ['project']);
    _gulp2.default.watch('./src/css/normalize.scss', ['normalize']);
    _gulp2.default.watch('./src/css/**/*.scss', ['webCss']);

    _gulp2.default.watch('./src/html/**/*.pug', ['webHtml']);
    _gulp2.default.watch('./src/js/**/*.es6', ['webJs']);
});