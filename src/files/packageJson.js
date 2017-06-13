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

	return pkg.get(addr);
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
			return command;
		},

		/**
		 * Append a given command to a script
		 *
		 * @param {string} name
		 * @param {string} command
		 * @return {string} Command after update
		 */
		appendScript(name, command) {
			return updateScript(pkg, name, command, prevCommand => [prevCommand, command].join(' && '));
		},

		/**
		 * Prepend a script with a given command
		 *
		 * @param {string} name
		 * @param {string} command
		 * @return {string} Command after update
		 */
		prependScript(name, command) {
			return updateScript(pkg, name, command, prevCommand => [command, prevCommand].join(' && '));
		},
	});
};
