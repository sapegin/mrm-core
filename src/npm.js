// @ts-check
'use strict';

const spawnSync = require('child_process').spawnSync;
const _ = require('lodash');
const listify = require('listify');
const log = require('./util/log');
const packageJson = require('./files/packageJson');

/** Install given npm packages if they aren’t installed yet */
function install(deps, options, exec) {
	options = options || {};
	deps = _.castArray(deps);
	const dev = options.dev !== false;
	const run = options.yarn ? runYarn : runNpm;

	const pkg = packageJson({
		dependencies: {},
		devDependencies: {},
	});
	const installed = pkg.get(dev ? 'devDependencies' : 'dependencies') || {};

	const newDeps = deps.filter(dep => !installed[dep]);
	if (newDeps.length === 0) {
		return;
	}

	log.info(`Installing ${listify(newDeps)}...`);
	run(newDeps, { dev }, exec);
}

/* Uninstall given npm packages */
function uninstall(deps, options, exec) {
	options = options || {};
	deps = _.castArray(deps);
	const dev = options.dev !== false;
	const run = options.yarn ? runYarn : runNpm;

	const pkg = packageJson({
		dependencies: {},
		devDependencies: {},
	});
	const installed = pkg.get(dev ? 'devDependencies' : 'dependencies') || {};

	const newDeps = deps.filter(dep => installed[dep]);

	if (newDeps.length === 0) {
		return;
	}

	log.info(`Uninstalling ${listify(newDeps)}...`);
	run(newDeps, { remove: true, dev }, exec);
}

/**
 * Install given npm packages
 *
 * @param {Array|string} deps
 * @param {Object} [options]
 * @param {boolean} [options.dev=true] --save-dev (--save by default)
 * @param {boolean} [options.remove=false] uninstall package (install by default)
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

function runYarn(deps, options, exec) {
	options = options || {};
	exec = exec || spawnSync;

	const add = options.dev ? ['add', '--dev'] : ['add'];
	const remove = ['remove'];
	const args = (options.remove ? remove : add).concat(deps);

	return exec('yarn', args, {
		stdio: options.stdio === undefined ? 'inherit' : options.stdio,
		cwd: options.cwd,
	});
}

module.exports = {
	install,
	uninstall,
};
