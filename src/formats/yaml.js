'use strict';

const fs = require('fs');
const { get, set, unset } = require('lodash');
const yaml = require('js-yaml');
const merge = require('../util/merge');
const { readFile, updateFile } = require('../core');

module.exports = function(filename, defaultValue = {}) {
	const exists = fs.existsSync(filename);

	let originalContent = '';
	let json = defaultValue;
	if (exists) {
		originalContent = readFile(filename);
		json = yaml.safeLoad(originalContent);
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
			const content = yaml.safeDump(json, null, '  ');
			updateFile(filename, content, originalContent, exists);
			return this;
		},
	};
};
