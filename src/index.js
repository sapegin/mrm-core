'use strict';

const core = require('./core');
const fs = require('./fs');
const npm = require('./npm');
const MrmError = require('./error');
const file = require('./formats/file');
const ini = require('./formats/ini');
const json = require('./formats/json');
const lines = require('./formats/lines');
const markdown = require('./formats/markdown');
const template = require('./formats/template');
const yaml = require('./formats/yaml');
const packageJson = require('./files/packageJson');

module.exports = {
	applyTemplate: core.applyTemplate,
	readFile: fs.readFile,
	updateFile: fs.updateFile,
	copyFiles: fs.copyFiles,
	deleteFiles: fs.deleteFiles,
	makeDirs: fs.makeDirs,
	install: npm.install,
	uninstall: npm.uninstall,
	MrmError,
	file,
	ini,
	json,
	lines,
	markdown,
	template,
	yaml,
	packageJson,
};
