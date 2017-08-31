'use strict';

jest.mock('fs');
jest.mock('../../util/log', () => ({
	added: jest.fn(),
}));

const vol = require('memfs').vol;
const log = require('../../util/log');
const json = require('../json');

const object = {
	bar: 42,
	baz: {
		foo: 43,
	},
};

const filename = '/test.json';
const fsJson = { '/test.json': JSON.stringify(object, null, '  ') };

afterEach(() => {
	vol.reset();
});

describe('json()', () => {
	it('should return an API', () => {
		const file = json('notfound');
		expect(file).toEqual(
			expect.objectContaining({
				exists: expect.any(Function),
				get: expect.any(Function),
				set: expect.any(Function),
				unset: expect.any(Function),
				merge: expect.any(Function),
				save: expect.any(Function),
			})
		);
	});

	it('should not fail when reading an empty file', () => {
		vol.fromJSON({ '/test.json': '' });
		const fn = () => json('/test.json');
		expect(fn).not.toThrow();
	});

	it('methods should be chainable', () => {
		const result = json(filename).set('a', 1).unset('a').merge({ a: 1 }).save().get();
		expect(result).toEqual({ a: 1 });
	});
});

describe('exists()', () => {
	it('should return true if file exists', () => {
		vol.fromJSON(fsJson);
		const file = json(filename);
		expect(file.exists()).toBeTruthy();
	});

	it('should return false if file does not exists', () => {
		const file = json('/notfound.json');
		expect(file.exists()).toBeFalsy();
	});
});

describe('get()', () => {
	it('should return object with all file contents', () => {
		vol.fromJSON(fsJson);
		const file = json(filename);
		expect(file.get()).toEqual(object);
	});

	it('get(path) should return a value', () => {
		vol.fromJSON(fsJson);
		const file = json(filename);
		expect(file.get('bar')).toBe(42);
	});

	it('get(nested.path) should return a nested value', () => {
		vol.fromJSON(fsJson);
		const file = json(filename);
		expect(file.get('baz.foo')).toBe(43);
	});

	it('should strip JSON comments', () => {
		vol.fromJSON({ '/comment.json': '{ /* Foo */ "bar": 42 }' });
		const file = json('/comment.json');
		expect(file.get('bar')).toEqual(42);
	});

	it('should return default value if file does not exist', () => {
		const obj = { zzz: 1 };
		const file = json(filename, obj);
		expect(file.get()).toEqual(obj);
	});

	it('should return an empty object without a file or default value', () => {
		const file = json(filename);
		expect(file.get()).toEqual({});
	});
});

describe('set()', () => {
	it('set() should replace the object', () => {
		vol.fromJSON(fsJson);
		const obj = { xyz: 1 };
		const file = json(filename);
		file.set(obj);
		expect(file.get()).toEqual(obj);
	});

	it('set(path) should set a value', () => {
		vol.fromJSON(fsJson);
		const file = json(filename);
		file.set('foo', 1);
		expect(file.get('foo')).toBe(1);
	});

	it('set(nested.path) should create a nested value', () => {
		const file = json(filename);
		file.set('xxx.yyy', 1);
		expect(file.get('xxx')).toEqual({ yyy: 1 });
	});
});

describe('unset()', () => {
	it('should delete a key', () => {
		vol.fromJSON(fsJson);
		const file = json(filename);
		file.unset('baz.foo');
		expect(file.get('baz')).toEqual({});
	});
});

describe('merge()', () => {
	it('should merge an object', () => {
		vol.fromJSON(fsJson);
		const file = json(filename);
		file.merge({ yyy: 1 });
		expect(file.get()).toEqual({
			bar: 42,
			baz: {
				foo: 43,
			},
			yyy: 1,
		});
	});
});

describe('save()', () => {
	afterEach(() => {
		log.added.mockClear();
	});

	it('should create file', () => {
		json(filename).set('foo', 1).save();
		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should update file', () => {
		vol.fromJSON(fsJson);
		json(filename).set('foo', 1).save();
		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should print a message that file was created', () => {
		json(filename).set('foo', 1).save();
		expect(log.added).toBeCalledWith('Create /test.json');
	});

	it('should print a message that file was updated', () => {
		vol.fromJSON(fsJson);
		json(filename).set('foo', 1).save();
		expect(log.added).toBeCalledWith('Update /test.json');
	});

	it('should not print a message if file was not changed', () => {
		vol.fromJSON(fsJson);
		json(filename).save();
		expect(log.added).toHaveBeenCalledTimes(0);
	});
});
