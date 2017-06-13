// @ts-check
'use strict';

const spawnSync = require('child_process').spawnSync;
const castArray = require('lodash/castArray');
const json = require('./formats/json');

/**
 * Install given npm packages if they aren’t installed yet
 *
 * @param {string|string[]} deps
 * @param {Object} [options]
 * @param {boolean} [options.dev=true] --save-dev
 * @param {Function} [exec]
 */
function install(deps, options, exec) {
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

	// eslint-disable-next-line no-console
	console.log(`Installing ${newDeps.join(', ')}...`);
	runNpm(newDeps, Object.assign({ dev }, options), exec);
}

/**
 * Install given npm packages
 *
 * @param {Array|string} deps
 * @param {Object} [options]
 * @param {boolean} [options.dev=true] --save-dev (--save by default)
 * @param {Function} [exec]
 * @return {Object}
 */
function runNpm(deps, options, exec) {
	options = options || {};
	exec = exec || spawnSync;

	const args = [
		options.remove ? 'uninstall' : 'install',
		options.dev ? '--save-dev' : '--save',
	].concat(deps);

	return exec('npm', args, {
		stdio: options.stdio === undefined ? 'inherit' : options.stdio,
		cwd: options.cwd,
	});
}

module.exports = {
	install,
};
