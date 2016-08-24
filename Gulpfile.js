'use strict';
var gulp = require('gulp');
var normalize = require('node-normalize-scss');
var sass = require('gulp-ruby-sass');
var pleeease = require('gulp-pleeease');
var sourcemaps = require('gulp-sourcemaps');
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();


gulp.task('stylesheets', function () {
	return sass([
				'./_source/assets/stylesheets/application.scss'
			], {
				style: 'expanded',
				loadPath: [ normalize.includePaths ],
				sourcemap: true,     // **
				emitCompileError: true,
				compass: false
			})
				.on('error', sass.logError)
		.pipe(pleeease({
			autoprefixer: true,
			filters: true,
			rem: true,
			pseudoElements: true,
			opacity: true,
			import: true,
			minifier: false,         // **
			mqpacker: false,
			sourcemaps: false,
			next: false
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./HTML/assets/stylesheets/'));
});


gulp.task('stylesheets-watch', ['stylesheets'], function (done) {
	browserSync.reload();
	done();
});


gulp.task('javascripts', function() {
	gulp.src(['_source/assets/javascripts/**/*.js'])
		.pipe(concat('application.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./HTML/assets/javascripts/'));
});


gulp.task('javascripts-watch', ['javascripts'], function (done) {
	browserSync.reload();
	done();
});


gulp.task('serve', ['stylesheets', 'javascripts'], function () {
	browserSync.init({
		server: {
			baseDir: 'HTML'
		}
	});

	gulp.watch([
		'./_source/assets/stylesheets/**/*.scss'
	], ['stylesheets-watch']);

	gulp.watch([
		'_source/assets/javascripts/**/*.js'
	], ['javascripts-watch']);

	gulp.watch("./HTML/*.html").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);
