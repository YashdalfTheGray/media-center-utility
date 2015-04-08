var gulp = require('gulp'),
	rename = require('gulp-rename'),
	_ = require('lodash'),
	del = require('del');

var videoFormats = [
	'.3g2',
	'.3gp',
	'.asf',
	'.asx',
	'.avi',
	'.flv',
	'.m4v',
	'.mov',
	'.mp4',
	'.mpg',
	'.rm',
	'.swf',
	'.vob',
	'.wmv'
];

exports.processFiles = function(source, destination, fileDetails) {
	gulp.src(source + '/**/*')
	.pipe(rename(function(path) {
		if (_.indexOf(videoFormats, path.extname) !== -1 && path.basename.indexOf('sample') === -1) {
			path.basename = fileDetails.title;
		}
		else if('.srt' === path.extname) {
			path.dirname = 'Subtitles';
			path.basename = fileDetails.title;
		}
		else {
			path.extname += '.fluff'
		}
	}))
	.pipe(gulp.dest(destination));
}

exports.cleanUp = function(destination) {
	del([destination + '/**/*.fluff'], {force: true});
}