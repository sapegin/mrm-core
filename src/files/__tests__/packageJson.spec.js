'use strict';

jest.mock('fs');

const fs = require('fs');
const packageJson = require('../packageJson');

const filename = 'package.json';

it('should return an API', () => {
	const file = packageJson('notfound');
	expect(file).toEqual(
		expect.objectContaining({
			getScript: expect.any(Function),
			setScript: expect.any(Function),
			appendScript: expect.any(Function),
			prependScript: expect.any(Function),
			removeScript: expect.any(Function),

			// Inherited from json()
			exists: expect.any(Function),
			get: expect.any(Function),
			set: expect.any(Function),
			unset: expect.any(Function),
			merge: expect.any(Function),
			save: expect.any(Function),
		})
	);
});

describe('packageJson', () => {
	it('should create package.json file', () => {
		packageJson().save();
		expect(fs.readFileSync(filename, 'utf8')).toBe('{}');
		fs.unlinkSync(filename);
	});

	it('methods inherited from json() should work', () => {
		fs.writeFileSync(filename, JSON.stringify({}));
		const file = packageJson();
		fs.unlinkSync(filename);
		expect(file.exists()).toBeTruthy();
	});

	it('should accept default value', () => {
		const value = { foo: 24 };
		const file = packageJson(value);
		expect(file.get()).toEqual(value);
	});

	it('all methods except getScript should be chainable', () => {
		const result = packageJson()
			.setScript('test', 'one')
			.prependScript('test', 'two')
			.appendScript('test', 'three')
			.removeScript('test', 'one')
			.getScript('test');
		expect(result).toBe('two && three');
	});
});

describe('getScript', () => {
	it('should create a script if it didn’t exist', () => {
		const file = packageJson({
			scripts: {
				pizza: 'quattro formaggi',
			},
		});
		const result = file.getScript('pizza');
		expect(result).toBe('quattro formaggi');
	});
});

describe('setScript', () => {
	it('should create a script if it didn’t exist', () => {
		const file = packageJson({
			scripts: {
				pizza: 'quattro formaggi',
			},
		});
		file.setScript('pizza', 'salami');
		expect(file.get()).toEqual({
			scripts: {
				pizza: 'salami',
			},
		});
	});
});

describe('appendScript', () => {
	it('should create a script if it didn’t exist', () => {
		const file = packageJson();
		file.appendScript('pizza', 'quattro formaggi');
		expect(file.get()).toEqual({
			scripts: {
				pizza: 'quattro formaggi',
			},
		});
	});

	it('should append a script if it exists', () => {
		const file = packageJson({
			scripts: {
				pizza: 'quattro formaggi',
			},
		});
		file.appendScript('pizza', 'salami');
		expect(file.get()).toEqual({
			scripts: {
				pizza: 'quattro formaggi && salami',
			},
		});
	});

	it('should owervrite a test script if it had a default value', () => {
		const file = packageJson({
			scripts: {
				test: 'echo "Error: no test specified" && exit 1',
			},
		});
		file.appendScript('test', 'quattro formaggi');
		expect(file.get()).toEqual({
			scripts: {
				test: 'quattro formaggi',
			},
		});
	});
});

describe('prependScript', () => {
	it('should create a script if it didn’t exist', () => {
		const file = packageJson();
		file.prependScript('pizza', 'quattro formaggi');
		expect(file.get()).toEqual({
			scripts: {
				pizza: 'quattro formaggi',
			},
		});
	});

	it('should prepend a script if it exists', () => {
		const file = packageJson({
			scripts: {
				pizza: 'quattro formaggi',
			},
		});
		file.prependScript('pizza', 'salami');
		expect(file.get()).toEqual({
			scripts: {
				pizza: 'salami && quattro formaggi',
			},
		});
	});

	it('should owervrite a test script if it had a default value', () => {
		const file = packageJson({
			scripts: {
				test: 'echo "Error: no test specified" && exit 1',
			},
		});
		file.prependScript('test', 'quattro formaggi');
		expect(file.get()).toEqual({
			scripts: {
				test: 'quattro formaggi',
			},
		});
	});
});

describe('removeScript', () => {
	it('should remove a command from a script', () => {
		const file = packageJson({
			scripts: {
				test: 'npm run lint && npm run test:jest',
			},
		});
		file.removeScript('test', /lint/);
		expect(file.get()).toEqual({
			scripts: {
				test: 'npm run test:jest',
			},
		});
	});

	it('should not change a script if a command not found', () => {
		const test = 'npm run lint && npm run test:jest';
		const file = packageJson({
			scripts: {
				test,
			},
		});
		file.removeScript('test', /mocha/);
		expect(file.get()).toEqual({
			scripts: {
				test,
			},
		});
	});

	it('should not change anything if a script not found', () => {
		const test = 'npm run lint && npm run test:jest';
		const file = packageJson({
			scripts: {
				test,
			},
		});
		file.removeScript('pizza', /mocha/);
		expect(file.get()).toEqual({
			scripts: {
				test,
			},
		});
	});

	it('should accept a string', () => {
		const file = packageJson({
			scripts: {
				test: 'npm run lint && npm run test:jest',
			},
		});
		file.removeScript('test', 'lint');
		expect(file.get()).toEqual({
			scripts: {
				test: 'npm run test:jest',
			},
		});
	});

	it('should remove the whole script if the second parameter omitted', () => {
		const file = packageJson({
			scripts: {
				test: 'npm run lint && npm run test:jest',
				pizza: 'salami',
			},
		});
		file.removeScript('test');
		expect(file.get()).toEqual({
			scripts: {
				pizza: 'salami',
			},
		});
	});

	it('should remove all scripts that match a regexp', () => {
		const file = packageJson({
			scripts: {
				test: 'npm run lint && npm run test:jest',
				jest: 'jest',
				pizza: 'salami',
			},
		});
		file.removeScript(/test|jest/);
		expect(file.get()).toEqual({
			scripts: {
				pizza: 'salami',
			},
		});
	});
});
