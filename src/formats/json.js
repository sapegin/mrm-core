// @ts-check
'use strict';

const _ = require('lodash');
const stripJsonComments = require('strip-json-comments');
const merge = require('../util/merge');
const base = require('./file');

function parse(string) {
	const withoutComments = stripJsonComments(string);
	if (withoutComments) {
		return JSON.parse(withoutComments);
	}
	return undefined;
}

module.exports = function(filename, defaultValue) {
	const file = base(filename);
	let json = parse(file.get()) || defaultValue || {};

	return {
		/** Return true if a file exists */
		exists() {
			return file.exists();
		},

		/** Get a value at a given address */
		get(address, defaultValue) {
			if (!address) {
				return json;
			}

			return _.get(json, address, defaultValue);
		},

		/** Set a value at a given address */
		set(address, value) {
			if (value === undefined) {
				json = address;
			} else {
				_.set(json, address, value);
			}
			return this;
		},

		/** Remove a section with a given address */
		unset(address) {
			_.unset(json, address);
			return this;
		},

		/** Merge a given value with the current value */
		merge(value) {
			json = merge(json, value);
			return this;
		},

		/** Save file */
		save() {
			const content = JSON.stringify(json, null, file.getIndent());
			file.save(content);
			return this;
		},
	};
};
