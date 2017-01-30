'use strict';

const mergeBase = require('webpack-merge');
const difference = require('lodash/difference');

const merge = mergeBase({
	customizeArray: (a, b) => a.concat(difference(b, a)),
});

module.exports = merge;
