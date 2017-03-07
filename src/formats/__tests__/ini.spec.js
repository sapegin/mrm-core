'use strict';

jest.mock('fs');

const fs = require('fs');
const ini = require('../ini');

fs.writeFileSync('test.ini', `
[foo]
bar = 42
`);

it('should return an API', () => {
	const file = ini('notfound');
	expect(file).toEqual(expect.objectContaining({
		exists: expect.any(Function),
		get: expect.any(Function),
		set: expect.any(Function),
		unset: expect.any(Function),
		save: expect.any(Function),
	}));
});

it('exists() should return true if file exists', () => {
	const file = ini('test.ini');
	expect(file.exists()).toBeTruthy();
});

it('exists() should return false if file does not exists', () => {
	const file = ini('notfound.ini');
	expect(file.exists()).toBeFalsy();
});

it('get() should return list of sections', () => {
	const file = ini('test.ini');
	expect(file.get()).toEqual(['foo']);
});

it('get(section) should return a section', () => {
	const file = ini('test.ini');
	expect(file.get('foo')).toEqual({
		bar: ' 42',
	});
});

it('set() should update section', () => {
	const file = ini('test.ini');
	file.set('foo', { bar: 'xxx' });
	expect(file.get('foo')).toEqual({
		bar: 'xxx',
	});
});

it('unset() should remove section', () => {
	const file = ini('test.ini');
	file.unset('foo');
	expect(file.get()).toEqual([]);
});

it('save() should create file', () => {
	const filename = 'new.ini';
	const file = ini(filename);
	file.set('foo', { bar: 'xxx' });
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe(`
[foo]
bar = xxx
`);
});

it('save() should create file with a comment', () => {
	const filename = 'new.ini';
	const file = ini(filename, 'comment');
	file.set('foo', { bar: 'xxx' });
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe(`# comment

[foo]
bar = xxx
`);
});

it('should not fail when reading an empty file', () => {
	const filename = 'empty.ini';
	fs.writeFileSync(filename, '');
	const fn = () => ini(filename);
	expect(fn).not.toThrow();
});
