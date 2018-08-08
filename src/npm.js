const spawnSync = require('child_process').spawnSync;
const fs = require('fs-extra');
const _ = require('lodash');
const semver = require('semver');
const listify = require('listify');
const log = require('./util/log');
const json = require('./formats/json');
const packageJson = require('./files/packageJson');
const MrmError = require('./error');

/** Install or update given npm packages if needed */
function install(deps, options, exec) {
	options = options || {};

	// options.versions is a min versions mapping,
	// the list of packages to install will be taken from deps
	let versions = options.versions || {};
	if (_.isPlainObject(deps)) {
		// deps is an object with required versions
		versions = deps;
		deps = Object.keys(deps);
	}

	deps = _.castArray(deps);
	const dev = options.dev !== false;
	const run = options.yarn || isUsingYarn() ? runYarn : runNpm;

	const newDeps = getUnsatisfiedDeps(deps, versions);
	if (newDeps.length === 0) {
		return;
	}

	log.info(`Installing ${listify(newDeps)}...`);
	const versionedDeps = newDeps.map(d => `${d}@latest`);
	run(versionedDeps, { dev }, exec);
}

/* Uninstall given npm packages */
function uninstall(deps, options, exec) {
	options = options || {};
	deps = _.castArray(deps);
	const dev = options.dev !== false;
	const run = options.yarn || isUsingYarn() ? runYarn : runNpm;

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

/**
 * Install given Yarn packages
 *
 * @param {Array|string} deps
 * @param {Object} [options]
 * @param {boolean} [options.dev=true] --dev (production by default)
 * @param {boolean} [options.remove=false] uninstall package (install by default)
 * @param {Function} [exec]
 * @return {Object}
 */
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

/**
 * Return version of installed npm package
 *
 * @param {string} name
 * @return {string}
 */
function getInstalledVersion(name) {
	return json(`./node_modules/${name}/package.json`).get('version');
}

/**
 * Return only not installed dependencies, or dependencies which installed
 * version doesn't satisfy range.
 *
 * @param {string[]} deps
 * @param {object} [versions]
 * @return {string[]}
 */
function getUnsatisfiedDeps(deps, versions) {
	return deps.filter(dep => {
		const installed = getInstalledVersion(dep);
		const required = versions[dep];

		// Package isn’t installed yet
		if (!installed) {
			return true;
		}

		// No required version specified
		if (!required) {
			// Install if the pacakge isn’t installed
			return !installed;
		}

		if (!semver.validRange(required)) {
			throw new MrmError(
				`Invalid npm version: ${
					required
				}. Use proper semver range syntax.`
			);
		}

		// Install if installed version doesn't satisfy range
		return !semver.satisfies(installed, required);
	});
}

/*
 * Is project using Yarn?
 *
 * @return {boolean}
 */
function isUsingYarn() {
	return fs.existsSync('yarn.lock');
}

module.exports = {
	install,
	uninstall,
};
