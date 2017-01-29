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
	expect(file).toEqual(expect.objectContaining({
		exists: expect.any(Function),
		get: expect.any(Function),
		apply: expect.any(Function),
		save: expect.any(Function),
	}));
});

it('exists() should return true if file exists', () => {
	const file = template('text', 'tmpl');
	expect(file.exists()).toBeTruthy();
});

it('exists() should return false if file does not exists', () => {
	const file = template('notfound.tmpl', 'tmpl');
	expect(file.exists()).toBeFalsy();
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
