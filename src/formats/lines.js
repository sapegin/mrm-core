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
		get() {
			return lines;
		},

		append(values) {
			values = castArray(values);
			const newValues = values.filter(value => !lines.includes(value));
			lines = lines.concat(newValues);
			return this;
		},

		save() {
			const content = lines.join('\n');
			updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
