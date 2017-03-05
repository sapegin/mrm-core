'use strict';

const fs = require('fs');
const castArray = require('lodash/castArray');
const splitLines = require('split-lines');
const core = require('../core');

module.exports = function(filename, defaultValue) {
	const exists = fs.existsSync(filename);

	let originalContent = '';
	let lines = defaultValue || [];
	if (exists) {
		originalContent = core.readFile(filename);
		lines = splitLines(originalContent);
	}

	return {
		exists() {
			return exists;
		},

		get() {
			return lines;
		},

		add(values) {
			values = castArray(values);
			const newValues = values.filter(value => lines.indexOf(value) === -1);
			lines = lines.concat(newValues);
			return this;
		},

		remove(values) {
			values = castArray(values);
			lines = lines.filter(value => values.indexOf(value.trim()) === -1);
			return this;
		},

		save() {
			const content = lines.join('\n');
			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
