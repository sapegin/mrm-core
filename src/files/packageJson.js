// @ts-check
'use strict';

const json = require('../formats/json');

const DEFAULT_TEST = 'echo "Error: no test specified" && exit 1';
const FILENAME = 'package.json';

const isDefaultTest = (name, command) => name === 'test' && command === DEFAULT_TEST;

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

module.exports = function(defaultValue) {
	const pkg = json(FILENAME, defaultValue);

	return Object.assign(pkg, {
		/**
		 * Return a script with a given name
		 *
		 * @param {string} name
		 * @return {string} Command
		 */
		getScript(name) {
			return pkg.get(['scripts', name]);
		},

		/**
		 * Replaces a script with a given command
		 *
		 * @param {string} name
		 * @param {string} command
		 * @return {string} Command after update
		 */
		setScript(name, command) {
			pkg.set(['scripts', name], command);
			return this;
		},

		/**
		 * Append a given command to a script
		 *
		 * @param {string} name
		 * @param {string} command
		 * @return {string} Command after update
		 */
		appendScript(name, command) {
			updateScript(pkg, name, command, prevCommand => [prevCommand, command].join(' && '));
			return this;
		},

		/**
		 * Prepend a script with a given command
		 *
		 * @param {string} name
		 * @param {string} command
		 * @return {string} Command after update
		 */
		prependScript(name, command) {
			updateScript(pkg, name, command, prevCommand => [command, prevCommand].join(' && '));
			return this;
		},

		/**
		 * Removes a script with a given name (or all script that match a regexp).
		 * Removes a subcommand (part between &&) from a script that matches a regexp if the match parameter is given.
		 *
		 * @param {RegExp|string} name Script name or RegExp
		 * @param {RegExp} [match] Subcommand RegExp
		 * @return {string|undefined} Command after update
		 */
		removeScript(name, match) {
			if (!match) {
				if (typeof name === 'string') {
					// Remove a script with a given name
					pkg.unset(['scripts', name]);
				} else {
					// Remove all scripts with names matching a regexp
					const scriptNames = Object.keys(pkg.get('scripts'));
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
			const newCommand = command.split(/\s*&&\s*/).filter(cmd => !cmd.match(match)).join(' && ');
			pkg.set(['scripts', name], newCommand);
			return this;
		},
	});
};
