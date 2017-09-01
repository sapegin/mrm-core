// @ts-check
'use strict';

const fs = require('fs-extra');
const _ = require('lodash');
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
		/** Return true if a file exists */
		exists() {
			return exists;
		},

		/** Return all values */
		get() {
			return lines;
		},

		/** Add given values */
		add(values) {
			values = _.castArray(values);
			const newValues = values.filter(value => lines.indexOf(value) === -1);
			lines = lines.concat(newValues);
			return this;
		},

		/** Remove given values */
		remove(values) {
			values = _.castArray(values);
			lines = lines.filter(value => values.indexOf(value.trim()) === -1);
			return this;
		},

		/** Save file */
		save() {
			const content = lines.filter(value => value.trim()).join('\n');
			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
