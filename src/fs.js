'use strict';

const fs = require('fs');
const path = require('path');
const castArray = require('lodash/castArray');
const cpFile = require('cp-file');
const mkdirp = require('mkdirp');
const del = require('del');
const chalk = require('chalk');
const listify = require('listify');
const core = require('./core');

/**
 * @param {string} file
 */
const read = file => (fs.existsSync(file) ? core.readFile(file).trim() : '');

/** Copy files from a given directory to the current working directory */
function copyFiles(sourceDir, files, options) {
	files = castArray(files);

	files.forEach(file => {
		const originalContent = read(file);

		cpFile.sync(path.resolve(sourceDir, file), file, options || {});

		const content = read(file);
		/* istanbul ignore if */
		if (content !== originalContent) {
			// eslint-disable-next-line no-console
			console.log(chalk.green(`Copy ${file}`));
		}
	});
}

/** Delete files with given glob patterns */
function deleteFiles(patterns, options) {
	patterns = castArray(patterns);

	const deletedFiles = del.sync(patterns, options || {});

	if (deletedFiles.length > 0) {
		// eslint-disable-next-line no-console
		console.log(chalk.yellow(`Delete ${listify(deletedFiles)}`));
	}
}

/** Create directories if they don’t exist */
function makeDirs(dirs) {
	dirs = castArray(dirs);

	dirs.forEach(dir => {
		const created = mkdirp.sync(dir);

		if (created) {
			// eslint-disable-next-line no-console
			console.log(chalk.green(`Create folder ${dir}`));
		}
	});
}

module.exports = {
	copyFiles,
	deleteFiles,
	makeDirs,
};
