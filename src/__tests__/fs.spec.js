'use strict';

jest.mock('cp-file');
jest.mock('mkdirp');

const path = require('path');
const cpFile = require('cp-file');
const mkdirp = require('mkdirp');
const fs = require('../fs');
const copyFiles = fs.copyFiles;
const makeDirs = fs.makeDirs;

afterEach(() => {
	cpFile.sync.mockClear();
	mkdirp.sync.mockClear();
});

it('copyFiles() should copy a file', () => {
	copyFiles('tmpl', 'a');
	expect(cpFile.sync).toHaveBeenCalledTimes(1);
	expect(cpFile.sync).toBeCalledWith(path.resolve('tmpl/a'), 'a', {});
});

it('copyFiles() should copy multiple files', () => {
	copyFiles('tmpl', ['a', 'b']);
	expect(cpFile.sync).toHaveBeenCalledTimes(2);
	expect(cpFile.sync).toBeCalledWith(path.resolve('tmpl/a'), 'a', {});
	expect(cpFile.sync).toBeCalledWith(path.resolve('tmpl/b'), 'b', {});
});

it('copyFiles() should pass options to cpFile', () => {
	copyFiles('tmpl', 'a', { overwrite: false });
	expect(cpFile.sync).toHaveBeenCalledTimes(1);
	expect(cpFile.sync).toBeCalledWith(path.resolve('tmpl/a'), 'a', { overwrite: false });
});

it('makeDirs() should create a folder', () => {
	makeDirs('a');
	expect(mkdirp.sync).toHaveBeenCalledTimes(1);
	expect(mkdirp.sync).toBeCalledWith('a');
});

it('makeDirs() should create multiple folders', () => {
	makeDirs(['a', 'b']);
	expect(mkdirp.sync).toHaveBeenCalledTimes(2);
	expect(mkdirp.sync).toBeCalledWith('a');
	expect(mkdirp.sync).toBeCalledWith('b');
});
