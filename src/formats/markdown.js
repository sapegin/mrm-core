// @ts-check
'use strict';

const fs = require('fs-extra');
const addBadge = require('readme-badger').addBadge;
const core = require('../core');
const MrmError = require('../error');

module.exports = function(filename) {
	const exists = fs.existsSync(filename);

	let content = '';
	let originalContent = '';
	if (exists) {
		content = core.readFile(filename);
		originalContent = content;
	}

	return {
		/** Return true if a file exists */
		exists() {
			return exists;
		},

		/** Get file content */
		get() {
			return content;
		},

		/** Add a badge */
		addBadge(imageUrl, linkUrl, altText) {
			if (!content) {
				throw new MrmError(`Can’t add badge: file "${filename}" not found.`);
			}

			if (content.includes(linkUrl)) {
				return this;
			}

			content = addBadge(content, 'md', imageUrl, linkUrl, altText);
			content = content.replace(/^(#.*?\n\n\[!\[.*?)\n\n\[!\[/m, '$1\n[!['); // Remove extra line between badges
			return this;
		},

		/** Save file */
		save() {
			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
