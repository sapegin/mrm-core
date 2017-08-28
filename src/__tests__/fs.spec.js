/* eslint-disable no-console */
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

// Return an array of “deleted” files
del.sync = jest.fn(_ => _);

afterEach(() => {
	cpFile.sync.mockClear();
	mkdirp.sync.mockClear();
	del.sync.mockClear();
});

describe('copyFiles()', () => {
	it('should copy a file', () => {
		copyFiles('tmpl', 'a');
		expect(cpFile.sync).toHaveBeenCalledTimes(1);
		expect(cpFile.sync).toBeCalledWith(path.resolve('tmpl/a'), 'a', {});
	});

	it('should copy multiple files', () => {
		copyFiles('tmpl', ['a', 'b']);
		expect(cpFile.sync).toHaveBeenCalledTimes(2);
		expect(cpFile.sync).toBeCalledWith(path.resolve('tmpl/a'), 'a', {});
		expect(cpFile.sync).toBeCalledWith(path.resolve('tmpl/b'), 'b', {});
	});

	it('should pass options to cpFile', () => {
		copyFiles('tmpl', 'a', { overwrite: false });
		expect(cpFile.sync).toHaveBeenCalledTimes(1);
		expect(cpFile.sync).toBeCalledWith(path.resolve('tmpl/a'), 'a', { overwrite: false });
	});
});

describe('makeDirs()', () => {
	it('should create a folder', () => {
		makeDirs('a');
		expect(mkdirp.sync).toHaveBeenCalledTimes(1);
		expect(mkdirp.sync).toBeCalledWith('a');
	});

	it('should create multiple folders', () => {
		makeDirs(['a', 'b']);
		expect(mkdirp.sync).toHaveBeenCalledTimes(2);
		expect(mkdirp.sync).toBeCalledWith('a');
		expect(mkdirp.sync).toBeCalledWith('b');
	});
});

describe('deleteFiles()', () => {
	it('should delete a file', () => {
		deleteFiles('Readme.md');
		expect(del.sync).toHaveBeenCalledTimes(1);
		expect(del.sync).toBeCalledWith(['Readme.md'], {});
	});

	it('should delete multiple files', () => {
		deleteFiles(['Readme.md', 'License.md']);
		expect(del.sync).toHaveBeenCalledTimes(1);
		expect(del.sync).toBeCalledWith(['Readme.md', 'License.md'], {});
	});

	it('should pass options to del.sync', () => {
		deleteFiles(['Readme.md', 'License.md'], { dryRun: true });
		expect(del.sync).toHaveBeenCalledTimes(1);
		expect(del.sync).toBeCalledWith(['Readme.md', 'License.md'], { dryRun: true });
	});

	it('should print names of deleted files', () => {
		const originalLog = console.log;
		console.log = jest.fn();

		deleteFiles(['Readme.md', 'License.md']);
		expect(console.log).toBeCalledWith(expect.stringMatching('Delete Readme.md and License.md'));

		console.log = originalLog;
	});

	it('should not print anything if no files were deleted', () => {
		const originalLog = console.log;
		console.log = jest.fn();

		deleteFiles([]);
		expect(console.log).toHaveBeenCalledTimes(0);

		console.log = originalLog;
	});
});
