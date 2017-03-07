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
		add: expect.any(Function),
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

it('add() should add lines', () => {
	const file = lines('test.lines');
	file.add(['three', 'four']);
	expect(file.get()).toEqual([
		'one',
		'two',
		'three',
		'four',
	]);
});

it('add() should accept parameter as a string', () => {
	const file = lines('test.lines');
	file.add('three');
	expect(file.get()).toEqual([
		'one',
		'two',
		'three',
	]);
});

it('add() should not reorder file when adding a line that already exists', () => {
	const file = lines('test.lines');
	file.add('two');
	expect(file.get()).toEqual(data);
});

it('remove() should remove lines', () => {
	const file = lines('test.lines');
	file.remove(['one']);
	expect(file.get()).toEqual([
		'two',
	]);
});

it('remove() should accept parameter as a string', () => {
	const file = lines('test.lines');
	file.remove('one');
	expect(file.get()).toEqual([
		'two',
	]);
});

it('save() should create file', () => {
	const filename = 'new.lines';
	const file = lines(filename);
	file.add(['foo', 'bar']);
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe('foo\nbar');
});

it('should not fail when reading an empty file', () => {
	const filename = 'empty.lines';
	fs.writeFileSync(filename, '');
	const fn = () => lines(filename);
	expect(fn).not.toThrow();
});
