'use strict';

const fs = require('fs');
const { readFile, updateFile, applyTemplate } = require('../core');

module.exports = function(filename, templateFile) {
	const exists = fs.existsSync(filename);

	let content = '';
	let originalContent = '';
	if (exists) {
		content = originalContent = readFile(filename);
	}

	return {
		exists() {
			return exists;
		},

		get() {
			return content;
		},

		apply(...contexts) {
			const context = Object.assign({}, ...contexts);
			content = applyTemplate(templateFile, context);
			return this;
		},

		save() {
			updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
