// @flow
'use strict';

const fs = require('fs');
const { get, set, unset } = require('lodash');
const parseJson = require('parse-json');
const merge = require('../util/merge');
const { readFile, updateFile } = require('../core');

/*:: type api = {
	exists: () => boolean,
	get: (address?: ?Array<string>|string, defaultValue?: any) => any,
	set: (address: Array<string>|string, value: any) => api,
	unset: (address: Array<string>|string) => api,
	merge: (value: Object) => api,
	save: () => api,
}; */

module.exports = function(filename /*: string */, defaultValue /*: any */ = {}) /*: api */ {
	const exists = fs.existsSync(filename);

	let originalContent = '';
	let json = defaultValue;
	if (exists) {
		originalContent = readFile(filename);
		json = parseJson(originalContent);
	}

	return {
		exists() {
			return exists;
		},

		get(address, defaultValue) {
			if (!address) {
				return json;
			}

			return get(json, address, defaultValue);
		},

		set(address, value) {
			set(json, address, value);
			return this;
		},

		unset(address) {
			unset(json, address);
			return this;
		},

		merge(value) {
			json = merge(json, value);
			return this;
		},

		save() {
			const content = JSON.stringify(json, null, '  ');
			updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
