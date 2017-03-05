'use strict';

const castArray = require('lodash/castArray');
const json = require('./formats/json');
const yarnInstall = require('yarn-install');

/* eslint-disable no-console */

function install(deps, options) {
	options = options || {};
	deps = castArray(deps);
	const dev = options.dev !== false;

	const pkg = json('package.json', {
		dependencies: {},
		devDependencies: {},
	});
	const installed = pkg.get(dev ? 'devDependencies' : 'dependencies') || {};

	const newDeps = deps.filter(dep => !installed[dep]);
	if (newDeps.length === 0) {
		return;
	}

	console.log(`Installing ${newDeps.join(', ')}...`);
	yarnInstall(newDeps, Object.assign({ dev }, options));
}

module.exports = {
	install,
};
