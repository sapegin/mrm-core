'use strict';

const fs = require('fs');
const addBadge = require('readme-badger').addBadge;
const core = require('../core');
const MrmError = require('../error');

module.exports = function(filename) {
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

		addBadge(imageUrl, linkUrl, altText) {
			if (!content) {
				throw new MrmError(`Can’t add badge: file "${filename}" not found.`);
			}

			if (content.includes(linkUrl)) {
				return this;
			}

			content = addBadge(content, 'md', imageUrl, linkUrl, altText);
			content = content.replace(/^(#.*?\n\n\[!\[.*?)\n\n\[!\[/m, '$1\n[![');  // Remove extra line between badges
			return this;
		},

		save() {
			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
