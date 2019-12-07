const escapeArguments = require('../escapeArguments');

it('escapeArguments should escape the ^', () => {
	const result = escapeArguments(['install', '--save-dev', 'eslint@^6.0.0']);

	expect(result).toEqual(['install', '--save-dev', 'eslint@^^^^6.0.0']);
});
