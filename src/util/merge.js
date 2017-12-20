const mergeBase = require('webpack-merge');
const _ = require('lodash');

/** Deep merge that merge arrays without duplicates */
const merge = mergeBase({
	customizeArray: (a, b) => a.concat(_.differenceWith(b, a, _.isEqual)),
});

module.exports = merge;
