const { spawnSync } = require('child_process');
const os = require('os');

const isWindows = os.platform() === 'win32';

/**
 * Execute a given command while being compatible with Windows.
 *
 * @param {Function} exec
 * @param {string} command
 * @param  {...any} args
 */
function execCommand(exec, command, ...args) {
	exec = exec || spawnSync;
	command = isWindows ? `${command}.cmd` : command;
	return exec(command, ...args);
}

module.exports = execCommand;
