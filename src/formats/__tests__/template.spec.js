'use strict';

jest.mock('fs');

const fs = require('fs');
const template = require('../template');

const tmpl = 'Hello, ${foo}!';
const text = 'Hello, Foo!';
const textNew = 'Hello, Bar!';

fs.writeFileSync('tmpl', tmpl);
fs.writeFileSync('text', text);

it('should return an API', () => {
	const file = template('notfound', 'notfound');
	expect(typeof file.get).toBe('function');
	expect(typeof file.apply).toBe('function');
	expect(typeof file.save).toBe('function');
});

it('get() should return file contents', () => {
	const file = template('text', 'tmpl');
	expect(file.get()).toEqual(text);
});

it('apply() should apply context to the template', () => {
	const file = template('text', 'tmpl');
	file.apply({ foo: 'Bar' });
	expect(file.get()).toBe(textNew);
});

it('save() should update file', () => {
	const file = template('text', 'tmpl');
	file.apply({ foo: 'Bar' });
	file.save();
	expect(fs.readFileSync('text', 'utf8')).toBe(textNew);
});

it('save() should create file', () => {
	const file = template('new', 'tmpl');
	file.apply({ foo: 'Bar' });
	file.save();
	expect(fs.readFileSync('new', 'utf8')).toBe(textNew);
});
