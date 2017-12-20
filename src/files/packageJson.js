// @ts-check
'use strict';

const json = require('../formats/json');

const DEFAULT_TEST = 'echo "Error: no test specified" && exit 1';
const FILENAME = 'package.json';

const isDefaultTest = (name, command) => name === 'test' && command === DEFAULT_TEST;

const splitSubcommands = script => script.split(/\s*&&\s*/);

/**
 * @param {Object} pkg
 * @param {string} name
 * @param {string} command
 * @param {Function} fn
 */
function updateScript(pkg, name, command, fn) {
	const addr = ['scripts', name];
	const prevCommand = pkg.get(addr);
	if (prevCommand && !isDefaultTest(name, prevCommand)) {
		if (!prevCommand.includes(command)) {
			pkg.set(addr, fn(prevCommand));
		}
	} else {
		pkg.set(addr, command);
	}
}

/**
 * @param {Object} defaultValue
 * @returns {any}
 */
module.exports = function(defaultValue) {
	const pkg = json(FILENAME, defaultValue);

	return Object.assign(pkg, {
		/** Return a script with a given name */
		getScript(name, subcommand) {
			const script = pkg.get(['scripts', name]);

			if (script && subcommand) {
				const regExp = new RegExp(`\\b${subcommand}\\b`);
				return splitSubcommands(script).find(s => s.match(regExp));
			}

			return script;
		},

		/** Replaces a script with a given command */
		setScript(name, command) {
			pkg.set(['scripts', name], command);
			return this;
		},

		/** Append a given command to a script */
		appendScript(name, command) {
			updateScript(pkg, name, command, prevCommand => [prevCommand, command].join(' && '));
			return this;
		},

		/** Prepend a script with a given command */
		prependScript(name, command) {
			updateScript(pkg, name, command, prevCommand => [command, prevCommand].join(' && '));
			return this;
		},

		/**
		 * Removes a script with a given name (or all scripts that match a regexp).
		 * Removes a subcommand (part between &&) from a script that matches a regexp if the match parameter is given.
		 */
		removeScript(name, match) {
			if (!match) {
				if (typeof name === 'string') {
					// Remove a script with a given name
					pkg.unset(['scripts', name]);
				} else {
					// Remove all scripts with names matching a regexp
					const scriptNames = Object.keys(pkg.get('scripts', {}));
					scriptNames.forEach(script => {
						if (script.match(name)) {
							pkg.unset(['scripts', script]);
						}
					});
				}
				return this;
			}

			// No script found with a given name
			const command = pkg.get(['scripts', name]);
			if (!command) {
				return this;
			}

			// Remove a subcommand from a script
			const newCommand = splitSubcommands(command)
				.filter(cmd => !cmd.match(match))
				.join(' && ');
			pkg.set(['scripts', name], newCommand);
			return this;
		},
	});
};
