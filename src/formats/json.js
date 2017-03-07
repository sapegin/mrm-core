'use strict';

const fs = require('fs');
const _ = require('lodash');
const stripJsonComments = require('strip-json-comments');
const merge = require('../util/merge');
const core = require('../core');

module.exports = function(filename, defaultValue) {
	const exists = fs.existsSync(filename);

	let originalContent = '';
	let json = defaultValue || {};
	if (exists) {
		originalContent = core.readFile(filename);
		const withoutComments = stripJsonComments(originalContent);
		if (withoutComments) {
			json = JSON.parse(withoutComments);
		}
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
			if (value === undefined) {
				json = address;
			}
			else {
				_.set(json, address, value);
			}
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
