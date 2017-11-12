'use strict';

jest.mock('fs');
jest.mock('../util/log', () => ({
	added: jest.fn(),
}));

const vol = require('memfs').vol;
const core = require('../core');

afterEach(() => {
	vol.reset();
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
