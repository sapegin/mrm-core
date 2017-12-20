/* eslint-disable no-console */

const chalk = require('chalk');

function info(message) {
	console.log(message);
}

function added(message) {
	console.log(chalk.green(message));
}

function removed(message) {
	console.log(chalk.yellow(message));
}

module.exports = {
	info,
	added,
	removed,
};
