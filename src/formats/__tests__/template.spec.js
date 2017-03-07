'use strict';

jest.mock('fs');

const fs = require('fs');
const template = require('../template');

const tmpl = 'Hello, ${foo}!';
const tmpl2 = 'Hello, ${foo} & ${bar}!';
const text = 'Hello, Foo!';
const textNew = 'Hello, Bar!';

fs.writeFileSync('tmpl', tmpl);
fs.writeFileSync('tmpl2', tmpl2);
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

it('apply() should apply multiple contexts to the template', () => {
	const file = template('text', 'tmpl2');
	file.apply({ foo: 'Foo' }, { bar: 'Bar' });
	expect(file.get()).toBe('Hello, Foo & Bar!');
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

it('should not fail when reading an empty file and template', () => {
	const filename = 'empty.txt';
	fs.writeFileSync(filename, '');
	const tmplfile = 'empty.tmpl';
	fs.writeFileSync(tmplfile, '');
	const fn = () => {
		const file = template(filename, tmplfile);
		file.apply({ foo: 'Bar' });
	};
	expect(fn).not.toThrow();
});
