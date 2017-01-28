'use strict';

const MrmError = require('../error');

it('MrmError should be Error descendant', () => {
	const err = new MrmError();
	expect(err instanceof Error).toBeTruthy();
});

it('toString() should contain a proper class name', () => {
	const err = new MrmError('nope');
	expect(err.toString()).toMatch('MrmError');
});

it('toString() should contain a message', () => {
	const err = new MrmError('nope');
	expect(err.toString()).toMatch('nope');
});
