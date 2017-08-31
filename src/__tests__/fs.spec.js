/* eslint-disable no-console */
'use strict';

jest.mock('fs');
jest.mock('../log', () => ({
	added: jest.fn(),
	removed: jest.fn(),
}));

const fs = require('fs-extra');
const { vol } = require('memfs');
const { added, removed } = require('../log');
const { copyFiles, deleteFiles, makeDirs } = require('../fs');

const fs$copySync = fs.copySync;

afterEach(() => {
	vol.reset();
	added.mockClear();
	removed.mockClear();
	fs.copySync = fs$copySync;
});

describe('copyFiles()', () => {
	it('should copy a file', () => {
		vol.fromJSON({ '/tmpl/a': 'pizza' });

		copyFiles('/tmpl', 'a');

		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should copy multiple files', () => {
		vol.fromJSON({ '/tmpl/a': 'pizza', '/tmpl/b': 'coffee' });

		copyFiles('/tmpl', ['a', 'b']);

		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should not copy a file if contents is the same', () => {
		fs.copySync = jest.fn();

		vol.fromJSON({ '/tmpl/a': 'pizza', '/tmpl/b': 'pizza', '/a': 'pizza', '/b': 'coffee' });

		copyFiles('/tmpl', ['a', 'b']);

		expect(fs.copySync).toHaveBeenCalledTimes(1);
		expect(fs.copySync).toBeCalledWith('/tmpl/b', 'b', {});
	});

	it('should not overwrite a file if overwrite=false', () => {
		const json = { '/tmpl/a': 'pizza', '/a': 'coffee' };
		vol.fromJSON(json);

		copyFiles('tmpl', 'a', { overwrite: false });

		expect(vol.toJSON()).toEqual(json);
	});

	it('should throw when source file not found', () => {
		const fn = () => copyFiles('tmpl', 'a');

		expect(fn).toThrowError('source file not found');
	});

	it('should print a file name', () => {
		vol.fromJSON({ '/tmpl/a': 'pizza' });

		copyFiles('/tmpl', 'a');

		expect(added).toBeCalledWith('Copy a');
	});

	it('should not print a file name if contents is the same', () => {
		vol.fromJSON({ '/tmpl/a': 'pizza', '/a': 'pizza' });

		copyFiles('/tmpl', 'a');

		expect(added).toHaveBeenCalledTimes(0);
	});
});

describe('deleteFiles()', () => {
	it('should delete a file', () => {
		vol.fromJSON({ '/a': 'pizza', '/b': 'coffee' });

		deleteFiles('/a');

		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should delete multiple files', () => {
		vol.fromJSON({ '/a': 'pizza', '/b': 'coffee', '/c': 'schawarma' });

		deleteFiles(['/a', '/b']);

		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should not throw when file not found', () => {
		const fn = () => deleteFiles('/a');

		expect(fn).not.toThrowError();
	});

	it('should print a file name', () => {
		vol.fromJSON({ '/a': 'pizza' });

		deleteFiles('/a');

		expect(removed).toBeCalledWith('Delete /a');
	});

	it('should not print a file name if file not found', () => {
		deleteFiles('/a');

		expect(removed).toHaveBeenCalledTimes(0);
	});
});

describe('makeDirs()', () => {
	it('should create a folder', () => {
		makeDirs('/a');

		expect(fs.statSync('/a').isDirectory()).toBe(true);
	});

	it('should create multiple folders', () => {
		makeDirs(['/a', '/b']);

		expect(fs.statSync('/a').isDirectory()).toBe(true);
		expect(fs.statSync('/b').isDirectory()).toBe(true);
	});

	it('should print a folder name', () => {
		makeDirs('/a');

		expect(added).toBeCalledWith('Create folder /a');
	});

	it('should not print a folder name if folder exists', () => {
		vol.fromJSON({ '/a/b': 'pizza' });

		deleteFiles('/a');

		expect(added).toHaveBeenCalledTimes(0);
	});
});
