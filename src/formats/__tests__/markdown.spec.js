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

fs.writeFileSync('test.md', md);

it('should return an API', () => {
	const file = markdown('notfound');
	expect(typeof file.get).toBe('function');
	expect(typeof file.addBadge).toBe('function');
	expect(typeof file.save).toBe('function');
});

it('get() should return all markdown', () => {
	const file = markdown('test.md');
	expect(file.get()).toBe(md);
});

it('addBadge() should add a badge', () => {
	const file = markdown('test.md');
	file.addBadge('http://example.com/badge.svg', 'http://example.com/', 'Example');
	expect(file.get()).toBe(mdWithBadge);
});

it('save() should update file', () => {
	const filename = 'test.md';
	const file = markdown(filename);
	file.addBadge('http://example.com/badge.svg', 'http://example.com/', 'Example');
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe(mdWithBadge);
});
