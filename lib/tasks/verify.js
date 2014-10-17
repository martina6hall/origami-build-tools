'use strict';

var files = require('../helpers/files'),
	log = require('../helpers/log'),
	path = require('path'),
	fs = require('fs'),
	jshint = require('gulp-jshint'),
	scsslint = require('gulp-scss-lint'),
	lintspaces = require('gulp-lintspaces'),
	excludePath = path.join(process.cwd(), '/.gitignore'),
	excludeFiles = pathsToGlob(fs.readFileSync(excludePath).toString().split('\n'));

module.exports = function(gulp, config) {
	module.exports.jsHint(gulp, config);
	module.exports.scssLint(gulp, config);
	module.exports.lintspaces(gulp);
};

function pathsToGlob(paths) {
    for (var i = 0; i < paths.length; i++) {
        var currentPath = path.join(process.cwd(), paths[i]);
	    var isExistingDirectory = fs.existsSync(currentPath) && fs.statSync(currentPath).isDirectory();

	    if (isExistingDirectory) {
	        currentPath = path.join(currentPath, '/**');
	    }
	    paths[i] = '!'+currentPath;
    }
    return paths;
}

/**
 * Run the SCSS gulp plugin.
 */
module.exports.scssLint = function(gulp, config) {
    if (!config.sass && !files.getMainSassPath()) {
        log.secondaryError('No main.scss');
        return;
    }
    var configPath = path.join(__dirname, '/../../config/scss-lint.yml');

    return gulp.src(['**/*.scss'].concat(excludeFiles))
    	.pipe(scsslint({
    		'config': configPath
    	}));
};

/**
 * Run the JSHint gulp plugin.
 */
module.exports.jsHint = function(gulp, config) {
	if(!config.js && !files.getMainJsPath()) {
		log.secondary('No main.js');
		return;
	}

    var configPath = path.join(__dirname, '/../../config/jshint.json');

	return gulp.src(['**/*.js'].concat(excludeFiles))
			.pipe(jshint(configPath))
			.pipe(jshint.reporter('default'));
};

module.exports.lintspaces = function(gulp) {
	if (!fs.existsSync('.editorconfig')) {
		log.secondaryError('No .editorconfig. Please run "origami-build-tools install --editorconfig" to add it');
	}
	return gulp.src(['**/*.scss', '**/*.js'].concat(excludeFiles))
		.pipe(lintspaces({
			newline: true,
			trailingspaces: true,
			indentation: 'tabs',
			ignores: ['js-comments'],
			editorconfig: '.editorconfig'
		}))
		.pipe(lintspaces.reporter())
		.on('error', function(err) { console.log(err) });
}

module.exports.watchable = true;
module.exports.description = 'Verify the module\'s conformity to the specification';