'use strict';

const fs = require('fs');
const path = require('path');
const castArray = require('lodash/castArray');
const cpFile = require('cp-file');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const core = require('./core');

const read = file => (fs.existsSync(file) ? core.readFile(file).trim() : '');

function copyFiles(sourceDir, files, options) {
	files = castArray(files);

	files.forEach(file => {
		const originalContent = read(file);

		cpFile.sync(path.resolve(sourceDir, file), file, options || {});

		const content = read(file);
		/* istanbul ignore if */
		if (content !== originalContent) {
			console.log(chalk.green(`Copy ${file}`)); // eslint-disable-line no-console
		}
	});
}

function makeDirs(dirs) {
	dirs = castArray(dirs);

	dirs.forEach(dir => {
		const created = mkdirp.sync(dir);

		if (created) {
			console.log(chalk.green(`Create folder ${dir}`)); // eslint-disable-line no-console
		}
	});
}

module.exports = {
	copyFiles,
	makeDirs,
};
