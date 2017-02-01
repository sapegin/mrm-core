// @flow
'use strict';

const fs = require('fs');
const get = require('lodash/get');
const set = require('lodash/set');
const parseJson = require('parse-json');
const merge = require('../util/merge');
const { readFile, updateFile } = require('../core');

/*:: type address = Array<string> | string; */
/*:: type api = {
	exists: function,
	get: function,
	set: function,
	merge: function,
	save: function,
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
		exists() /*: boolean */ {
			return exists;
		},

		get(address /*: address */, defaultValue /*: any */) /*: any */ {
			if (!address) {
				return json;
			}

			return get(json, address, defaultValue);
		},

		set(address /*: address */, value /*: any */) /*: api */ {
			set(json, address, value);
			return this;
		},

		merge(value /*: any */) /*: api */ {
			json = merge(json, value);
			return this;
		},

		save() /*: api */ {
			const content = JSON.stringify(json, null, '  ');
			updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
