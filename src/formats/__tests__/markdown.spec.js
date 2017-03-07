'use strict';

jest.mock('fs');

const fs = require('fs');
const markdown = require('../markdown');

const md = `
# Foo

Hello.
`;

const mdWithBadge = `
# Foo

[![Example](http://example.com/badge.svg)](http://example.com/)

Hello.
`;

const addBadge = file => file.addBadge('http://example.com/badge.svg', 'http://example.com/', 'Example');

fs.writeFileSync('test.md', md);

it('should return an API', () => {
	const file = markdown('notfound');
	expect(file).toEqual(expect.objectContaining({
		exists: expect.any(Function),
		get: expect.any(Function),
		addBadge: expect.any(Function),
		save: expect.any(Function),
	}));
});

it('exists() should return true if file exists', () => {
	const file = markdown('test.md');
	expect(file.exists()).toBeTruthy();
});

it('exists() should return false if file does not exists', () => {
	const file = markdown('notfound.md');
	expect(file.exists()).toBeFalsy();
});

it('get() should return all markdown', () => {
	const file = markdown('test.md');
	expect(file.get()).toBe(md);
});

it('addBadge() should add a badge', () => {
	const file = markdown('test.md');
	addBadge(file);
	expect(file.get()).toBe(mdWithBadge);
});

it('addBadge() should not add badge with the same link twice', () => {
	const file = markdown('test.md');

	addBadge(file);
	const before = file.get();
	addBadge(file);
	const after = file.get();
	expect(after).toBe(before);
});

it('addBadge() should not add empty lines between badges', () => {
	const file = markdown('test.md');

	addBadge(file);
	file.addBadge('http://example2.com/badge.svg', 'http://example2.com/', 'Example 2');
	const result = file.get();
	expect(result).toMatch(`
[![Example 2](http://example2.com/badge.svg)](http://example2.com/)
[![Example](http://example.com/badge.svg)](http://example.com/)
`);
});

it('addBadge() should throw if file not found', () => {
	const file = markdown('notfound');
	const fn = () => addBadge(file);
	expect(fn).toThrowError('Can’t add badge');
});

it('save() should update file', () => {
	const filename = 'test.md';
	const file = markdown(filename);
	addBadge(file);
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe(mdWithBadge);
});

it('should not fail when reading an empty file', () => {
	const filename = 'empty.md';
	fs.writeFileSync(filename, '');
	const fn = () => markdown(filename);
	expect(fn).not.toThrow();
});
