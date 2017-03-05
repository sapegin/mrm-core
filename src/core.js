'use strict';

const fs = require('fs');
const vm = require('vm');
const chalk = require('chalk');
const stripBom = require('strip-bom');
const codeFrame = require('babel-code-frame');
const MrmError = require('./error');

/* eslint-disable no-console */

function readFile(filepath) {
	return stripBom(fs.readFileSync(filepath, 'utf8'));
}

function updateFile(filename, content, originalContent, exists) {
	if (content.trim() !== originalContent.trim()) {
		fs.writeFileSync(filename, content);
		printStatus(filename, exists);
	}
}

function printStatus(filename, updated) {
	const message = updated ? 'Updated' : 'Created';
	console.log(chalk.green(`${message} ${filename}`));
}

function applyTemplate(templateFile, context) {
	const template = readFile(templateFile).replace(/`/g, '\\`');
	try {
		return vm.runInNewContext('`' + template + '`', context);
	}
	catch (exception) {
		const m = exception.stack.match(/evalmachine\.<anonymous>:(\d+)(?::(\d+))?\n/);
		const line = m && m[1];
		const col = m && (m[2] || 1);
		const code = codeFrame(template, Number(line), Number(col));
		throw new MrmError(`Error in template ${templateFile}:${line}:${col}\n${exception.message}\n\n${code}`);
	}
}

module.exports = {
	readFile,
	updateFile,
	printStatus,
	applyTemplate,
};
