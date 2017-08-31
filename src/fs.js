// @ts-check
'use strict';

const path = require('path');
const fs = require('fs-extra');
const castArray = require('lodash/castArray');
const core = require('./core');
const log = require('./util/log');
const MrmError = require('./error');

/**
 * @param {string} file
 */
const read = file => (fs.existsSync(file) ? core.readFile(file).trim() : '');

/** Copy files from a given directory to the current working directory */
function copyFiles(sourceDir, files, options) {
	castArray(files).forEach(file => {
		const sourcePath = path.resolve(sourceDir, file);
		if (!fs.existsSync(sourcePath)) {
			throw new MrmError(`copyFiles: source file not found: ${sourcePath}`);
		}

		// Skip copy if file contents are the same
		if (read(sourcePath) === read(file)) {
			return;
		}

		log.added(`Copy ${file}`);
		fs.copySync(sourcePath, file, options || {});
	});
}

/** Delete files or folders */
function deleteFiles(files) {
	castArray(files).forEach(file => {
		if (!fs.existsSync(file)) {
			return;
		}

		log.removed(`Delete ${file}`);
		fs.removeSync(file);
	});
}

/** Create directories if they don’t exist */
function makeDirs(dirs) {
	castArray(dirs).forEach(dir => {
		if (fs.existsSync(dir)) {
			return;
		}

		log.added(`Create folder ${dir}`);
		fs.ensureDirSync(dir);
	});
}

module.exports = {
	copyFiles,
	deleteFiles,
	makeDirs,
};
