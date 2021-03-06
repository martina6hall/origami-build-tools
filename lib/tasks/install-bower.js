'use strict';

const process = require('process');
const writer = require('flush-write-stream');
const Listr = require('listr');

const files = require('../helpers/files');
const runBowerInstall = require('./run-bower-install');

module.exports = function (cfg) {
	const config = cfg || {};
	config.cwd = config.cwd || process.cwd();

	return {
		title: 'Installing Bower components',
		task: () => {
			return new Listr([{
				title: 'Starting Bower',
				task: (context, task) => runBowerInstall({
					stdout: writer(function write(data, enc, cb) {
						task.title = data.toString();
						cb();
					}),
					stderr: false,
					cwd: config.cwd
				})
			}]);
		},
		skip: function () {
			return files.bowerJsonExists(config.cwd)
				.then(exists => {
					if (!exists) {
						return 'No bower.json found.';
					}
				});
		}
	};
};
