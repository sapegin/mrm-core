'use strict';

const core = require('./core');
const fs = require('./fs');
const MrmError = require('./error');
const ini = require('./formats/ini');
const json = require('./formats/json');
const lines = require('./formats/lines');
const markdown = require('./formats/markdown');
const template = require('./formats/template');
const yaml = require('./formats/yaml');
const install = require('./npm').install;

module.exports = {
	readFile: core.readFile,
	updateFile: core.updateFile,
	applyTemplate: core.applyTemplate,
	copyFiles: fs.copyFiles,
	makeDirs: fs.makeDirs,
	MrmError,
	ini,
	json,
	lines,
	markdown,
	template,
	yaml,
	install,
};
