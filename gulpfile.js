var gulp = require('gulp'),
	gutil = require('gulp-util'),
	os = require('os'),
	colors = require('colors'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish-ex'),
	karma = require('karma').server,
	jasmine = require('gulp-jasmine'),
	nodemon = require('gulp-nodemon')/*,
	server = require('./server/server.js')*/;

gulp.task('default', ['usage']);

gulp.task('usage', function() {
	var usageLines = [
		'',
		'',
		colors.green('usage'),
		'\tDisplay this help page.',
		'',
		colors.green('start'),
		'\t runs the app server using express.',
		'',
		colors.green('jshint'),
		'\tRun jshint on the spec and the js folder under src.',
		'',
		colors.green('test:server'),
		'\tRun the server-side unit tests using Jasmine.',
		'',
		colors.green('test:client'),
		'\tRun the client-side unit tests using Jasmine and Karma.',
		'',
		colors.green('test'),
		'\tRun both the server and the client side unit tests.',
		''
	];
	gutil.log(usageLines.join(os.EOL));
});

gulp.task('start', function() {
	nodemon({ script: 'server/server.js' });
});

gulp.task('jshint', function() {
	var linting = gulp.src([
		'spec/**/*.js',
		'src/js/**/*.js',
		'gulpfile.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
	return linting;
});

gulp.task('test:server', ['_test:server'], function() {
	process.exit(0);
});

gulp.task('_test:server', function() {
	var jasmineTests = gulp.src('spec/server/**/*.spec.js')
	.pipe(jasmine({
		verbose: true
	}));
	return jasmineTests;
});

gulp.task('test:client', function(done) {
	karma.start({
		configFile: __dirname + '/spec/support/test.conf.js',
		singleRun: true
	}, done);
});

gulp.task('test', ['_test:server', 'test:client'], function() {
	process.exit(0);
});