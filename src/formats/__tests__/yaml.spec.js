'use strict';

jest.mock('fs');

const fs = require('fs');
const yaml = require('../yaml');

fs.writeFileSync('test.yml', `bar: 42
baz:
  foo:
    43
`);

it('should return an API', () => {
	const file = yaml('notfound');
	expect(file).toEqual(expect.objectContaining({
		exists: expect.any(Function),
		get: expect.any(Function),
		set: expect.any(Function),
		unset: expect.any(Function),
		merge: expect.any(Function),
		save: expect.any(Function),
	}));
});

it('exists() should return true if file exists', () => {
	const file = yaml('test.yml');
	expect(file.exists()).toBeTruthy();
});

it('exists() should return false if file does not exists', () => {
	const file = yaml('notfound.yml');
	expect(file.exists()).toBeFalsy();
});

it('get() should return object with all file contents', () => {
	const file = yaml('test.yml');
	expect(file.get()).toEqual({
		bar: 42,
		baz: {
			foo: 43,
		},
	});
});

it('get(path) should return a value', () => {
	const file = yaml('test.yml');
	expect(file.get('bar')).toBe(42);
});

it('get(nested.path) should return a nested value', () => {
	const file = yaml('test.yml');
	expect(file.get('baz.foo')).toBe(43);
});

it('set() should replace the object', () => {
	const obj = { xyz: 1 };
	const file = yaml('test.yml');
	file.set(obj);
	expect(file.get()).toEqual(obj);
});

it('set(path) should set a value', () => {
	const file = yaml('test.yml');
	file.set('foo', 1);
	expect(file.get('foo')).toBe(1);
});

it('set(nested.path) should create a nested value', () => {
	const file = yaml('test.yml');
	file.set('xxx.yyy', 1);
	expect(file.get('xxx')).toEqual({ yyy: 1 });
});

it('unset(path) should delete a key', () => {
	const file = yaml('test.yml');
	file.unset('baz.foo');
	expect(file.get('baz')).toEqual({});
});

it('merge() should merge an object', () => {
	const file = yaml('test.yml');
	file.merge({ yyy: 1 });
	expect(file.get()).toEqual({
		bar: 42,
		baz: {
			foo: 43,
		},
		yyy: 1,
	});
});

it('should return default value if file does not exist', () => {
	const obj = { zzz: 1 };
	const file = yaml('notfound', obj);
	expect(file.get()).toEqual(obj);
});

it('save() should create file', () => {
	const filename = 'new.yml';
	const file = yaml(filename);
	file.set('foo', 1);
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe('foo: 1\n');
});

it('should not fail when reading an empty file', () => {
	const filename = 'empty.yml';
	fs.writeFileSync(filename, '');
	const fn = () => yaml(filename);
	expect(fn).not.toThrow();
});
