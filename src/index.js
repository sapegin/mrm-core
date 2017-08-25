'use strict';

const core = require('./core');
const fs = require('./fs');
const npm = require('./npm');
const MrmError = require('./error');
const ini = require('./formats/ini');
const json = require('./formats/json');
const lines = require('./formats/lines');
const markdown = require('./formats/markdown');
const template = require('./formats/template');
const yaml = require('./formats/yaml');
const packageJson = require('./files/packageJson');

module.exports = {
	readFile: core.readFile,
	updateFile: core.updateFile,
	applyTemplate: core.applyTemplate,
	copyFiles: fs.copyFiles,
	deleteFiles: fs.deleteFiles,
	makeDirs: fs.makeDirs,
	install: npm.install,
	uninstall: npm.uninstall,
	MrmError,
	ini,
	json,
	lines,
	markdown,
	template,
	yaml,
	packageJson,
};
