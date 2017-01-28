'use strict';

jest.mock('yarn-install');

const yarnInstall = require('yarn-install');
const { install } = require('../npm');

const modules = ['eslint', 'babel-core'];

it('install() should install an npm modules to devDependencies', () => {
	install(modules);
	expect(yarnInstall).toBeCalledWith(modules, { dev: true });
});

it('install() should install an npm modules to dependencies', () => {
	install(modules, { dev: false });
	expect(yarnInstall).toBeCalledWith(modules, { dev: false });
});
