const propIni = require('prop-ini');
const base = require('./file');

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
	const file = base(filename);

	const ini = propIni.createInstance({});
	ini.decode({
		data: file.get(),
	});

	return {
		/** Return true if a file exists */
		exists() {
			return file.exists();
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
			file.save(content);
			return this;
		},
	};
};
