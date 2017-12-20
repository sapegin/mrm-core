const { templateFromFile } = require('smpltmpl');
const base = require('./file');

module.exports = function(filename, templateFile) {
	const file = base(filename);

	let content = file.get();
	let applied = false;

	return {
		/** Return true if a file exists */
		exists() {
			return file.exists();
		},

		/** Get file content */
		get() {
			return content;
		},

		/** Expand a template with given objects as a context */
		apply(...contexts) {
			applied = true;
			const context = Object.assign(...[{}].concat(contexts));
			content = templateFromFile(templateFile, context);
			return this;
		},

		/** Save file */
		save() {
			if (!applied) {
				throw Error(
					`Attempt to save the template "${
						filename
					}" without expanding: it doesn’t make sense. Call apply() before save().`
				);
			}

			file.save(content);
			return this;
		},
	};
};
