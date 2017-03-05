'use strict';

const _ = require('lodash');
const fs = require('fs');
const core = require('../core');

module.exports = function(filename, templateFile) {
	const exists = fs.existsSync(filename);

	let content = '';
	let originalContent = '';
	if (exists) {
		content = originalContent = core.readFile(filename);
	}

	return {
		exists() {
			return exists;
		},

		get() {
			return content;
		},

		apply() {
			const contexts = _.toArray(arguments);
			const context = Object.assign.apply(Object, [{}].concat(contexts));
			content = core.applyTemplate(templateFile, context);
			return this;
		},

		save() {
			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
