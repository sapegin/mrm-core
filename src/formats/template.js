'use strict';

const _ = require('lodash');
const fs = require('fs');
const core = require('../core');

module.exports = function(filename, templateFile) {
	const exists = fs.existsSync(filename);

	let content = '';
	let originalContent = '';
	let applied = false;
	if (exists) {
		content = core.readFile(filename);
		originalContent = content;
	}

	return {
		exists() {
			return exists;
		},

		get() {
			return content;
		},

		apply() {
			applied = true;
			const contexts = _.toArray(arguments);
			const context = Object.assign.apply(Object, [{}].concat(contexts));
			content = core.applyTemplate(templateFile, context);
			return this;
		},

		save() {
			if (!applied) {
				throw Error(
					`Attempt to save the template "${filename}" without expanding: it doesn’t make sense. Call apply() before save().`
				);
			}

			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
