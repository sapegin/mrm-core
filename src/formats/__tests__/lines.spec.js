'use strict';

jest.mock('fs');
jest.mock('../../util/log', () => ({
	added: jest.fn(),
}));

const vol = require('memfs').vol;
const log = require('../../util/log');
const lines = require('../lines');

const filename = '/test.lines';
const data = ['one', 'two'];
const json = { '/test.lines': data.join('\n') };

afterEach(() => {
	vol.reset();
});

describe('lines()', () => {
	it('should return an API', () => {
		const file = lines('notfound');
		expect(file).toEqual(
			expect.objectContaining({
				exists: expect.any(Function),
				get: expect.any(Function),
				add: expect.any(Function),
				remove: expect.any(Function),
				save: expect.any(Function),
			})
		);
	});

	it('should not fail when reading an empty file', () => {
		vol.fromJSON({ '/empty.lines': '' });
		const fn = () => lines('/empty.lines');
		expect(fn).not.toThrow();
	});

	it('methods should be chainable', () => {
		const result = lines(filename).add(['a']).remove(['a']).save().get();
		expect(result).toEqual([]);
	});
});

describe('exists()', () => {
	it('should return true if file exists', () => {
		vol.fromJSON(json);
		const file = lines(filename);
		expect(file.exists()).toBeTruthy();
	});

	it('should return false if file does not exists', () => {
		const file = lines('/notfound.lines');
		expect(file.exists()).toBeFalsy();
	});
});

describe('get()', () => {
	it('should return all lines', () => {
		vol.fromJSON(json);
		const file = lines(filename);
		expect(file.get()).toEqual(data);
	});

	it('should accept default value', () => {
		const array = ['one', 'two'];
		const file = lines(filename, array);
		expect(file.get()).toEqual(array);
	});

	it('should return an empty array without a file or default value', () => {
		const file = lines(filename);
		expect(file.get()).toEqual([]);
	});
});

describe('add()', () => {
	it('should add lines', () => {
		vol.fromJSON(json);
		const file = lines(filename);
		file.add(['three', 'four']);
		expect(file.get()).toEqual(['one', 'two', 'three', 'four']);
	});

	it('should accept parameter as a string', () => {
		vol.fromJSON(json);
		const file = lines(filename);
		file.add('three');
		expect(file.get()).toEqual(['one', 'two', 'three']);
	});

	it('should not reorder file when adding a line that already exists', () => {
		vol.fromJSON(json);
		const file = lines(filename);
		file.add('two');
		expect(file.get()).toEqual(data);
	});
});

describe('remove()', () => {
	it('should remove lines', () => {
		vol.fromJSON(json);
		const file = lines(filename);
		file.remove(['one']);
		expect(file.get()).toEqual(['two']);
	});

	it('should accept parameter as a string', () => {
		vol.fromJSON(json);
		const file = lines(filename);
		file.remove('one');
		expect(file.get()).toEqual(['two']);
	});

	it('should do nothing if all lines don’t exist in a file', () => {
		vol.fromJSON(json);
		const file = lines(filename);
		file.remove(['three']);
		expect(file.get()).toEqual(data);
	});
});

describe('save()', () => {
	afterEach(() => {
		log.added.mockClear();
	});

	it('should create file', () => {
		lines(filename).add(['foo', 'bar']).save();
		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should save file without empty lines', () => {
		vol.fromJSON({ '/new.lines': 'one\n\n\ntwo\n' });
		lines('/new.lines').add(['foo', 'bar']).save();
		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should print a message that file was created', () => {
		lines(filename).add(['foo']).save();
		expect(log.added).toBeCalledWith('Create /test.lines');
	});

	it('should print a message that file was updated', () => {
		vol.fromJSON(json);
		lines(filename).add(['foo']).save();
		expect(log.added).toBeCalledWith('Update /test.lines');
	});

	it('should not print a message if file was not changed', () => {
		vol.fromJSON(json);
		lines(filename).add(['one']).save();
		expect(log.added).toHaveBeenCalledTimes(0);
	});
});
