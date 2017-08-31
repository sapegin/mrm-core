'use strict';

jest.mock('fs');
jest.mock('../util/log', () => ({
	added: jest.fn(),
}));

const vol = require('memfs').vol;
const log = require('../util/log');
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

		expect(log.added).toBeCalledWith('Update foo');
	});

	it('should print "created"', () => {
		core.printStatus('foo', false);

		expect(log.added).toBeCalledWith('Create foo');
	});
});

describe('applyTemplate()', () => {
	it('should apply template to a file', () => {
		vol.fromJSON({ '/a': 'Hello, ${foo}!' });

		const result = core.applyTemplate('/a', { foo: 'Bar' });

		expect(result).toBe('Hello, Bar!');
	});

	it('should escape `', () => {
		vol.fromJSON({ '/a': 'Hello, `${foo}`!' });

		const fn = () => core.applyTemplate('/a', { foo: 'Bar' });
		expect(fn).not.toThrowError();

		const result = fn();
		expect(result).toBe('Hello, `Bar`!');
	});

	it('should throw if a template file not found', () => {
		const fn = () => core.applyTemplate('/a', {});

		expect(fn).toThrowError('Template file not found: /a');
	});

	it('should throw if a template has a syntax error', () => {
		vol.fromJSON({ '/a': 'Hello, ${foo!' });

		const fn = () => core.applyTemplate('/a', { foo: 'Bar' });

		expect(fn).toThrowError('Error in template /a');
	});

	it('should throw if context variable is missed', () => {
		vol.fromJSON({ '/a': 'Hello, ${foo}!' });

		const fn = () => core.applyTemplate('/a', { bar: 'Bar' });

		expect(fn).toThrowError('foo is not defined');
	});
});
