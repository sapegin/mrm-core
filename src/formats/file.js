// @ts-check
'use strict';

const readFile = require('../fs').readFile;
const updateFile = require('../fs').updateFile;
const editorconfig = require('../editorconfig');

/** Base file reader / writer */
module.exports = function(filename) {
	let exists = true;
	let originalContent = '';
	try {
		originalContent = readFile(filename);
	} catch (err) {
		if (err.code === 'ENOENT') {
			exists = false;
		} else {
			throw err;
		}
	}

	return {
		/** Return true if a file exists */
		exists() {
			return exists;
		},

		/** Return file content */
		get() {
			return originalContent;
		},

		/** Return EditorCofig style for a file */
		getStyle() {
			if (originalContent) {
				return editorconfig.infer(originalContent);
			}

			return editorconfig.read(filename);
		},

		/** Return indentation string for a file */
		getIndent() {
			return editorconfig.getIndent(this.getStyle());
		},

		/** Save file */
		save(content) {
			if (content.trim() !== originalContent.trim()) {
				content = editorconfig.format(content, this.getStyle());
				updateFile(filename, content, exists);
			}

			return this;
		},
	};
};
