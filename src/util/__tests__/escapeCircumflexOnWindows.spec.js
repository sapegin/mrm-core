const escapeCircumflexOnWindows = require('../escapeCircumflexOnWindows');

it('escapeCircumflexOnWindows should escape the ^', () => {
	const result = escapeCircumflexOnWindows([
		'install',
		'--save-dev',
		'eslint@^6.0.0',
	]);

	expect(result).toEqual([
		'install',
		'--save-dev',
		// Since the result depend on the platform
		// we need to allow both output
		expect.stringMatching(/eslint@(\^{1}|\^{4})6.0.0/),
	]);
});
