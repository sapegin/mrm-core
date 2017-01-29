'use strict';

jest.mock('fs');

const fs = require('fs');
const lines = require('../lines');

const data = [
	'one',
	'two',
];

fs.writeFileSync('test.lines', data.join('\n'));

it('should return an API', () => {
	const file = lines('notfound');
	expect(file).toEqual(expect.objectContaining({
		exists: expect.any(Function),
		get: expect.any(Function),
		append: expect.any(Function),
		save: expect.any(Function),
	}));
});

it('exists() should return true if file exists', () => {
	const file = lines('test.lines');
	expect(file.exists()).toBeTruthy();
});

it('exists() should return false if file does not exists', () => {
	const file = lines('notfound.lines');
	expect(file.exists()).toBeFalsy();
});

it('get() should return all lines', () => {
	const file = lines('test.lines');
	expect(file.get()).toEqual(data);
});

it('append() should add lines', () => {
	const file = lines('test.lines');
	file.append(['three', 'four']);
	expect(file.get('foo')).toEqual([
		'one',
		'two',
		'three',
		'four',
	]);
});

it('append() should accept parameter as a string', () => {
	const file = lines('test.lines');
	file.append('three');
	expect(file.get('foo')).toEqual([
		'one',
		'two',
		'three',
	]);
});

it('append() should not reorder file when adding a line that already exists', () => {
	const file = lines('test.lines');
	file.append('two');
	expect(file.get('foo')).toEqual(data);
});

it('save() should create file', () => {
	const filename = 'new.lines';
	const file = lines(filename);
	file.append(['foo', 'bar']);
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe('foo\nbar');
});
