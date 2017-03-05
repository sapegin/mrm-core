// @flow
'use strict';

const fs = require('fs');
const _ = require('lodash');
const stripJsonComments = require('strip-json-comments');
const merge = require('../util/merge');
const core = require('../core');

/* :: type api = {
	exists: () => boolean,
	get: (address?: ?Array<string>|string, defaultValue?: any) => any,
	set: (address: Array<string>|string, value: any) => api,
	unset: (address: Array<string>|string) => api,
	merge: (value: Object) => api,
	save: () => api,
}; */

module.exports = function(filename /* : string */, defaultValue /* : any */) /* : api */ {
	const exists = fs.existsSync(filename);

	let originalContent = '';
	let json = defaultValue || {};
	if (exists) {
		originalContent = core.readFile(filename);
		json = JSON.parse(stripJsonComments(originalContent));
	}

	return {
		exists() {
			return exists;
		},

		get(address, defaultValue) {
			if (!address) {
				return json;
			}

			return _.get(json, address, defaultValue);
		},

		set(address, value) {
			_.set(json, address, value);
			return this;
		},

		unset(address) {
			_.unset(json, address);
			return this;
		},

		merge(value) {
			json = merge(json, value);
			return this;
		},

		save() {
			const content = JSON.stringify(json, null, '  ');
			core.updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
