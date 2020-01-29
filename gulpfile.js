const gulp = require('gulp');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const del = require('del');

/**
 * Clean dist files
 */
const clean = () => del(['dist/']);

/**
 * Compile and minify code
 */
function build() {
    return gulp.src('src/*.ts')
        .pipe(ts({
            noImplicitAny: false,
            module: 'commonjs',
        }))
        .pipe(uglify())
        .pipe(rename('imageGallery.min.js'))
        .pipe(gulp.dest('dist/'))
}

exports.clean = clean;
exports.build = gulp.series(clean, build);
exports.default = () => gulp.watch('src/', gulp.series(clean, build));