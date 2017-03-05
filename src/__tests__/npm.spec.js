'use strict';

jest.mock('fs');
jest.mock('yarn-install');

const fs = require('fs');
const yarnInstall = require('yarn-install');
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
	yarnInstall.mockClear();
});

it('install() should install an npm packages to devDependencies', () => {
	createPackageJson({}, {});
	install(modules);
	expect(yarnInstall).toBeCalledWith(modules, { dev: true });
});

it('install() should install an npm packages to dependencies', () => {
	createPackageJson({}, {});
	install(modules, { dev: false });
	expect(yarnInstall).toBeCalledWith(modules, { dev: false });
});

it('install() should not install already installed packages', () => {
	createPackageJson({}, { eslint: '*' });
	install(modules);
	expect(yarnInstall).toBeCalledWith(['babel-core'], { dev: true });
});

it('install() should accept the first parameter as a string', () => {
	createPackageJson({}, {});
	install(modules[0]);
	expect(yarnInstall).toBeCalledWith([modules[0]], { dev: true });
});

it('install() should not run Yarn when there are no new packages', () => {
	createPackageJson({}, {
		eslint: '*',
		'babel-core': '*',
	});
	install(modules);
	expect(yarnInstall).toHaveBeenCalledTimes(0);
});

it('install() should not throw when package.json not found', () => {
	const fn = () => install(modules);
	expect(fn).not.toThrow();
});

it('install() should not throw when package.json has no dependencies section', () => {
	createPackageJson();
	const fn = () => install(modules);
	expect(fn).not.toThrow();
});
