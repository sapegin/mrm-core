'use strict';

jest.mock('cp-file');
jest.mock('mkdirp');
jest.mock('del');

const path = require('path');
const cpFile = require('cp-file');
const mkdirp = require('mkdirp');
const del = require('del');
const fs = require('../fs');
const copyFiles = fs.copyFiles;
const makeDirs = fs.makeDirs;
const deleteFiles = fs.deleteFiles;

del.sync = jest.fn(_ => _);

afterEach(() => {
	cpFile.sync.mockClear();
	mkdirp.sync.mockClear();
	del.sync.mockClear();
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

it('deleteFiles() should delete multiple files', () => {
	deleteFiles(['Readme.md', 'License.md']);
	expect(del.sync).toHaveBeenCalledTimes(1);
	expect(del.sync).toBeCalledWith(['Readme.md', 'License.md'], {});
});

it('deleteFiles() should pass options to del.sync', () => {
	deleteFiles(['Readme.md', 'License.md'], { dryRun: true });
	expect(del.sync).toHaveBeenCalledTimes(1);
	expect(del.sync).toBeCalledWith(['Readme.md', 'License.md'], { dryRun: true });
});
