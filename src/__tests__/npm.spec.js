'use strict';

jest.mock('fs');
jest.mock('../util/log', () => ({
	info: jest.fn(),
}));

const fs = require('fs-extra');
const vol = require('memfs').vol;
const log = require('../util/log');
const _npm = require('../npm');
const install = _npm.install;
const uninstall = _npm.uninstall;

const modules = ['eslint', 'babel-core'];

const createPackageJson = (dependencies, devDependencies) => {
	fs.writeFileSync(
		'package.json',
		JSON.stringify({
			dependencies,
			devDependencies,
		})
	);
};

afterEach(() => {
	vol.reset();
	log.info.mockClear();
});

describe('install()', () => {
	it('should install an npm packages to devDependencies', () => {
		const spawn = jest.fn();
		createPackageJson({}, {});
		install(modules, undefined, spawn);
		expect(spawn).toBeCalledWith('npm', ['install', '--save-dev', 'eslint', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should install yarn packages to devDependencies', () => {
		const spawn = jest.fn();
		createPackageJson({}, {});
		install(modules, { yarn: true }, spawn);
		expect(spawn).toBeCalledWith('yarn', ['add', '--dev', 'eslint', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should install an npm packages to dependencies', () => {
		const spawn = jest.fn();
		createPackageJson({}, {});
		install(modules, { dev: false }, spawn);
		expect(spawn).toBeCalledWith('npm', ['install', '--save', 'eslint', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should install yarn packages to dependencies', () => {
		const spawn = jest.fn();
		createPackageJson({}, {});
		install(modules, { dev: false, yarn: true }, spawn);
		expect(spawn).toBeCalledWith('yarn', ['add', 'eslint', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should not install already installed packages', () => {
		const spawn = jest.fn();
		createPackageJson({}, { eslint: '*' });
		install(modules, undefined, spawn);
		expect(spawn).toBeCalledWith('npm', ['install', '--save-dev', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should accept the first parameter as a string', () => {
		const spawn = jest.fn();
		createPackageJson({}, {});
		install(modules[0], undefined, spawn);
		expect(spawn).toBeCalledWith('npm', ['install', '--save-dev', modules[0]], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should not run npm when there are no new packages', () => {
		const spawn = jest.fn();
		createPackageJson(
			{},
			{
				eslint: '*',
				'babel-core': '*',
			}
		);
		install(modules, undefined, spawn);
		expect(spawn).toHaveBeenCalledTimes(0);
	});

	it('should not throw when package.json not found', () => {
		const spawn = jest.fn();
		const fn = () => install(modules, undefined, spawn);
		expect(fn).not.toThrow();
	});

	it('should not throw when package.json has no dependencies section', () => {
		const spawn = jest.fn();
		createPackageJson();
		const fn = () => install(modules, undefined, spawn);
		expect(fn).not.toThrow();
	});

	it('should print module names', () => {
		install(modules, undefined, () => {});

		expect(log.info).toBeCalledWith('Installing eslint and babel-core...');
	});

	it('should print only module names that are not installed', () => {
		createPackageJson(
			{},
			{
				eslint: '*',
			}
		);
		install(modules, undefined, () => {});

		expect(log.info).toBeCalledWith('Installing babel-core...');
	});
});

describe('uninstall()', () => {
	it('should uninstall an npm packages from devDependencies', () => {
		const spawn = jest.fn();
		createPackageJson(
			{},
			{
				eslint: '*',
				'babel-core': '*',
			}
		);
		uninstall(modules, undefined, spawn);
		expect(spawn).toBeCalledWith('npm', ['uninstall', '--save-dev', 'eslint', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should uninstall yarn packages from devDependencies', () => {
		const spawn = jest.fn();
		createPackageJson(
			{},
			{
				eslint: '*',
				'babel-core': '*',
			}
		);
		uninstall(modules, { yarn: true }, spawn);
		expect(spawn).toBeCalledWith('yarn', ['remove', 'eslint', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should uninstall an npm packages from dependencies', () => {
		const spawn = jest.fn();
		createPackageJson(
			{
				eslint: '*',
				'babel-core': '*',
			},
			{}
		);
		uninstall(modules, { dev: false }, spawn);
		expect(spawn).toBeCalledWith('npm', ['uninstall', '--save', 'eslint', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should uninstall yarn packages from dependencies', () => {
		const spawn = jest.fn();
		createPackageJson(
			{
				eslint: '*',
				'babel-core': '*',
			},
			{}
		);
		uninstall(modules, { dev: false, yarn: true }, spawn);
		expect(spawn).toBeCalledWith('yarn', ['remove', 'eslint', 'babel-core'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should not uninstall not installed packages', () => {
		const spawn = jest.fn();
		createPackageJson({}, { eslint: '*' });
		uninstall(modules, undefined, spawn);
		expect(spawn).toBeCalledWith('npm', ['uninstall', '--save-dev', 'eslint'], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should accept the first parameter as a string', () => {
		const spawn = jest.fn();
		createPackageJson(
			{},
			{
				eslint: '*',
			}
		);
		uninstall(modules[0], undefined, spawn);
		expect(spawn).toBeCalledWith('npm', ['uninstall', '--save-dev', modules[0]], {
			cwd: undefined,
			stdio: 'inherit',
		});
	});

	it('should not run npm when there are no packages to uninstall', () => {
		const spawn = jest.fn();
		createPackageJson({}, {});
		uninstall(modules, undefined, spawn);
		expect(spawn).toHaveBeenCalledTimes(0);
	});

	it('should not throw when package.json not found', () => {
		const spawn = jest.fn();
		const fn = () => uninstall(modules, undefined, spawn);
		expect(fn).not.toThrow();
	});

	it('should not throw when package.json has no dependencies section', () => {
		const spawn = jest.fn();
		createPackageJson();
		const fn = () => uninstall(modules, undefined, spawn);
		expect(fn).not.toThrow();
	});

	it('should print module names', () => {
		createPackageJson(
			{},
			{
				eslint: '*',
				'babel-core': '*',
			}
		);
		uninstall(modules, undefined, () => {});

		expect(log.info).toBeCalledWith('Uninstalling eslint and babel-core...');
	});

	it('should print only module names that are installed', () => {
		createPackageJson(
			{},
			{
				eslint: '*',
			}
		);
		uninstall(modules, undefined, () => {});

		expect(log.info).toBeCalledWith('Uninstalling eslint...');
	});
});
