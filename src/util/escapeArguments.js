/**
 * Escape given arguments to be compatible with Windows.
 *
 * @param {string[]} args
 */
function escapeArguments(args) {
	return args.map(arg => arg.replace(/\^/g, '^^^^'));
}

module.exports = escapeArguments;
