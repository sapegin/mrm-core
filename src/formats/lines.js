'use strict';

const fs = require('fs');
const castArray = require('lodash/castArray');
const splitLines = require('split-lines');
const { readFile, updateFile } = require('../core');

module.exports = function(filename, defaultValue = []) {
	const exists = fs.existsSync(filename);

	let originalContent = '';
	let lines = defaultValue;
	if (exists) {
		originalContent = readFile(filename);
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
			const newValues = values.filter(value => !lines.includes(value));
			lines = lines.concat(newValues);
			return this;
		},

		remove(values) {
			values = castArray(values);
			lines = lines.filter(value => !values.includes(value.trim()));
			return this;
		},

		save() {
			const content = lines.join('\n');
			updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
