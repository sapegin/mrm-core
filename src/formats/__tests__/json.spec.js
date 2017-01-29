'use strict';

jest.mock('fs');

const fs = require('fs');
const json = require('../json');

const object = {
	bar: 42,
	baz: {
		foo: 43,
	},
};

fs.writeFileSync('test.json', JSON.stringify(object));

it('should return an API', () => {
	const file = json('notfound');
	expect(file).toEqual(expect.objectContaining({
		exists: expect.any(Function),
		get: expect.any(Function),
		set: expect.any(Function),
		merge: expect.any(Function),
		save: expect.any(Function),
	}));
});

it('exists() should return true if file exists', () => {
	const file = json('test.json');
	expect(file.exists()).toBeTruthy();
});

it('exists() should return false if file does not exists', () => {
	const file = json('notfound.json');
	expect(file.exists()).toBeFalsy();
});

it('get() should return object with all file contents', () => {
	const file = json('test.json');
	expect(file.get()).toEqual(object);
});

it('get(path) should return a value', () => {
	const file = json('test.json');
	expect(file.get('bar')).toBe(42);
});

it('get(nested.path) should return a nested value', () => {
	const file = json('test.json');
	expect(file.get('baz.foo')).toBe(43);
});

it('set(path) should set a value', () => {
	const file = json('test.json');
	file.set('foo', 1);
	expect(file.get('foo')).toBe(1);
});

it('set(nested.path) should create a nested value', () => {
	const file = json('test.json');
	file.set('xxx.yyy', 1);
	expect(file.get('xxx')).toEqual({ yyy: 1 });
});

it('merge() should merge an object', () => {
	const file = json('test.json');
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
	const file = json('notfound', obj);
	expect(file.get()).toEqual(obj);
});

it('save() should create file', () => {
	const filename = 'new.json';
	const file = json(filename);
	file.set('foo', 1);
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe(JSON.stringify({ foo: 1 }, null, '  '));
});
