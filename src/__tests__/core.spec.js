'use strict';

jest.mock('fs');
jest.mock('../log', () => ({
	added: jest.fn(),
}));

const vol = require('memfs').vol;
const log = require('../log');
const core = require('../core');

afterEach(() => {
	vol.reset();
});

describe('readFile()', () => {
	it('should read a file', () => {
		const contents = 'test';
		vol.fromJSON({ '/a': contents });

		const result = core.readFile('/a');

		expect(result).toBe(contents);
	});

	it('should strip BOM marker', () => {
		const contents = 'test';
		vol.fromJSON({ '/a': '\uFEFF' + contents });

		const result = core.readFile('/a');

		expect(result).toBe(contents);
	});
});

describe('updateFile()', () => {
	it('should update a file', () => {
		const contents = 'test';
		vol.fromJSON({ '/a': contents });

		core.updateFile('/a', 'pizza', contents, true);

		expect(vol.toJSON()).toMatchSnapshot();
	});

	it('should not update a file if contents is the same except leading/trailing whitespace', () => {
		const contents = '  test  ';
		const json = { '/a': contents };
		vol.fromJSON(json);

		core.updateFile('/a', 'test', contents, true);

		expect(vol.toJSON()).toEqual(json);
	});
});

describe('printStatus()', () => {
	afterEach(() => {
		log.added.mockClear();
	});

	it('should print "updated"', () => {
		core.printStatus('foo', true);

		expect(log.added).toBeCalledWith('Updated foo');
	});

	it('should print "created"', () => {
		core.printStatus('foo', false);

		expect(log.added).toBeCalledWith('Created foo');
	});
});

describe('applyTemplate()', () => {
	it('should apply template to a file', () => {
		vol.fromJSON({ '/a': 'Hello, ${foo}!' });

		const result = core.applyTemplate('/a', { foo: 'Bar' });

		expect(result).toBe('Hello, Bar!');
	});

	it('should throw if a template has a syntax error', () => {
		vol.fromJSON({ '/a': 'Hello, ${foo!' });

		const fn = () => core.applyTemplate('/a', { foo: 'Bar' });

		expect(fn).toThrowError('Error in template /a');
	});
});
