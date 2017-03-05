'use strict';

/* eslint-disable no-console */

jest.mock('fs');

const fs = require('fs');
const core = require('../core');

it('readFile() should read a file', () => {
	const filename = 'testfile';
	const contents = 'test';
	fs.writeFileSync(filename, contents);
	const result = core.readFile(filename);
	expect(result).toBe(contents);
});

it('readFile() should strip BOM marker', () => {
	const filename = 'testfile';
	const contents = 'test';
	fs.writeFileSync(filename, '\uFEFF' + contents);

	const result = core.readFile(filename);
	expect(result).toBe(contents);
});

it('updateFile() should update a file', () => {
	const filename = 'testfile';
	const contents = 'test';
	const newContents = 'new';
	fs.writeFileSync(filename, contents);

	core.updateFile(filename, newContents, contents, true);
	const result = fs.readFileSync(filename, 'utf8');
	expect(result).toBe(newContents);
});

it('updateFile() should not update a file if contents is the same except leading/trailing whitespace', () => {
	const filename = 'testfile';
	const contents = '  test  ';
	const newContents = 'test';
	fs.writeFileSync(filename, contents);

	core.updateFile(filename, newContents, contents, true);
	const result = fs.readFileSync(filename, 'utf8');
	expect(result).toBe(contents);
});

it('printStatus() should print "updated"', () => {
	const originalLog = console.log;
	console.log = jest.fn();

	core.printStatus('foo', true);
	expect(console.log).toBeCalledWith(expect.stringMatching('Updated foo'));

	console.log = originalLog;
});

it('printStatus() should print "created"', () => {
	const originalLog = console.log;
	console.log = jest.fn();

	core.printStatus('foo', false);
	expect(console.log).toBeCalledWith(expect.stringMatching('Created foo'));

	console.log = originalLog;
});

it('applyTemplate() should apply template to a file', () => {
	const filename = 'testfile';
	const contents = 'Hello, ${foo}!';
	fs.writeFileSync(filename, contents);

	const result = core.applyTemplate(filename, { foo: 'Bar' });
	expect(result).toBe('Hello, Bar!');
});

it('applyTemplate() should throw if a template has a syntax error', () => {
	const filename = 'testfile';
	const contents = 'Hello, ${foo!';
	fs.writeFileSync(filename, contents);

	const fn = () => core.applyTemplate(filename, { foo: 'Bar' });
	expect(fn).toThrowError('Error in template testfile');
});
