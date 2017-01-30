'use strict';

const mergeBase = require('webpack-merge');
const differenceWith = require('lodash/differenceWith');
const isEqual = require('lodash/isEqual');

const merge = mergeBase({
	customizeArray: (a, b) => a.concat(differenceWith(b, a, isEqual)),
});

module.exports = merge;
