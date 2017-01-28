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
	expect(typeof file.get).toBe('function');
	expect(typeof file.append).toBe('function');
	expect(typeof file.save).toBe('function');
});

it('get() should return all lines', () => {
	const file = lines('test.lines');
	expect(file.get()).toEqual(data);
});

it('append() should add lines', () => {
	const file = lines('test.lines');
	file.append('three', 'four');
	expect(file.get('foo')).toEqual([
		'three',
		'four',
		'one',
		'two',
	]);
});

it('save() should create file', () => {
	const filename = 'new.lines';
	const file = lines(filename);
	file.append('foo', 'bar');
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe('foo\nbar');
});
