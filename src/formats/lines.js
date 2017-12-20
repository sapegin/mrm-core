const _ = require('lodash');
const splitLines = require('split-lines');
const base = require('./file');

module.exports = function(filename, defaultValue) {
	const file = base(filename);

	let lines = file.get() ? splitLines(file.get().trim()) : defaultValue || [];

	return {
		/** Return true if a file exists */
		exists() {
			return file.exists();
		},

		/** Return all values */
		get() {
			return lines;
		},

		/** Replace all with given values */
		set(values) {
			lines = values;
			return this;
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
			const content = lines.join('\n');
			file.save(content);
			return this;
		},
	};
};
