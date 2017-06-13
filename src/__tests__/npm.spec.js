'use strict';

jest.mock('fs');

const fs = require('fs');
const install = require('../npm').install;

const modules = ['eslint', 'babel-core'];

const createPackageJson = (dependencies, devDependencies) => {
	fs.writeFileSync('package.json', JSON.stringify({
		dependencies,
		devDependencies,
	}));
};

afterEach(() => {
	fs.unlink('package.json');
});

it('install() should install an npm packages to devDependencies', () => {
	const spawn = jest.fn();
	createPackageJson({}, {});
	install(modules, undefined, spawn);
	expect(spawn).toBeCalledWith(
		'npm',
		['install', '--save-dev', 'eslint', 'babel-core'],
		{ cwd: undefined, stdio: 'inherit' }
	);
});

it('install() should install an npm packages to dependencies', () => {
	const spawn = jest.fn();
	createPackageJson({}, {});
	install(modules, { dev: false }, spawn);
	expect(spawn).toBeCalledWith(
		'npm',
		['install', '--save', 'eslint', 'babel-core'],
		{ cwd: undefined, stdio: 'inherit' }
	);
});

it('install() should not install already installed packages', () => {
	const spawn = jest.fn();
	createPackageJson({}, { eslint: '*' });
	install(modules, undefined, spawn);
	expect(spawn).toBeCalledWith(
		'npm',
		['install', '--save-dev', 'babel-core'],
		{ cwd: undefined, stdio: 'inherit' }
	);
});

it('install() should accept the first parameter as a string', () => {
	const spawn = jest.fn();
	createPackageJson({}, {});
	install(modules[0], undefined, spawn);
	expect(spawn).toBeCalledWith(
		'npm',
		['install', '--save-dev', modules[0]],
		{ cwd: undefined, stdio: 'inherit' }
	);
});

it('install() should not run npm when there are no new packages', () => {
	const spawn = jest.fn();
	createPackageJson({}, {
		eslint: '*',
		'babel-core': '*',
	});
	install(modules, undefined, spawn);
	expect(spawn).toHaveBeenCalledTimes(0);
});

it('install() should not throw when package.json not found', () => {
	const spawn = jest.fn();
	const fn = () => install(modules, undefined, spawn);
	expect(fn).not.toThrow();
});

it('install() should not throw when package.json has no dependencies section', () => {
	const spawn = jest.fn();
	createPackageJson();
	const fn = () => install(modules, undefined, spawn);
	expect(fn).not.toThrow();
});
