'use strict';

const { readFile, updateFile, applyTemplate } = require('./core');
const MrmError = require('./error');
const ini = require('./formats/ini');
const json = require('./formats/json');
const lines = require('./formats/lines');
const markdown = require('./formats/markdown');
const template = require('./formats/template');
const yaml = require('./formats/yaml');
const { install } = require('./npm');

module.exports = {
	readFile,
	updateFile,
	applyTemplate,
	MrmError,
	ini,
	json,
	lines,
	markdown,
	template,
	yaml,
	install,
};
