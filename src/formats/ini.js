// @ts-check
'use strict';

const fs = require('fs-extra');
const propIni = require('prop-ini');
const core = require('../core');

/**
 * Adds spaces before and after `=`.
 *
 * @param {string} content
 * @returns {string}
 */
function prettify(content) {
	return `${content}\n`.replace(/\s*=\s*/g, ' = ');
}

module.exports = function(filename, comment) {
	const ini = propIni.createInstance({});
	const exists = fs.existsSync(filename);

	let originalContent = '';
	if (exists) {
		originalContent = core.readFile(filename);
		ini.decode({
			data: originalContent,
		});
	} else {
		ini.decode({
			data: '',
		});
	}

	return {
		/** Return true if a file exists */
		exists() {
			return exists;
		},

		/** Get a value of a given section */
		get(section) {
			if (!section) {
				return ini.getSections();
			}

			return ini.getData(section);
		},

		/** Set a value of a given section */
		set(section, value) {
			ini.addData(value, section);
			return this;
		},

		/** Remove a given section */
		unset(section) {
			ini.removeData(section);
			return this;
		},

		/** Save file */
		save() {
			const encoded = prettify(ini.encode());
			const content = comment ? `# ${comment}\n${encoded}` : encoded;
			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
