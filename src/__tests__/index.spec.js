'use strict';

const index = require('../index');

it('should contain all API functions', () => {
	expect(index).toEqual(expect.objectContaining({
		readFile: expect.any(Function),
		updateFile: expect.any(Function),
		applyTemplate: expect.any(Function),
		copyFiles: expect.any(Function),
		makeDirs: expect.any(Function),
		MrmError: expect.any(Function),
		ini: expect.any(Function),
		json: expect.any(Function),
		lines: expect.any(Function),
		markdown: expect.any(Function),
		template: expect.any(Function),
		yaml: expect.any(Function),
		install: expect.any(Function),
	}));
});
