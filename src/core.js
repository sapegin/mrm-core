// @ts-check
'use strict';

const fs = require('fs');
const vm = require('vm');
const stripBom = require('strip-bom');
const codeFrame = require('babel-code-frame');
const log = require('./util/log');
const MrmError = require('./error');

/** Read a text file as UTF-8 */
function readFile(filename) {
	return stripBom(fs.readFileSync(filename, 'utf8'));
}

/** Write a file if the content was changed and print a message. */
function updateFile(filename, content, originalContent, exists) {
	if (content.trim() !== originalContent.trim()) {
		fs.writeFileSync(filename, content);
		printStatus(filename, exists);
	}
}

/** Print status message: Updated <file> or Created <file> */
function printStatus(filename, updated) {
	const message = updated ? 'Updated' : 'Created';
	log.added(`${message} ${filename}`);
}

/** Expand template using given object as a context */
function applyTemplate(templateFile, context) {
	const template = readFile(templateFile).replace(/`/g, '\\`');
	try {
		return vm.runInNewContext('`' + template + '`', context);
	} catch (exception) {
		const m = exception.stack.match(/evalmachine\.<anonymous>:(\d+)(?::(\d+))?\n/);
		const line = m && m[1];
		const col = m && (m[2] || 1);
		const code = codeFrame(template, Number(line), Number(col));
		throw new MrmError(
			`Error in template ${templateFile}:${line}:${col}\n${exception.message}\n\n${code}`
		);
	}
}

module.exports = {
	readFile,
	updateFile,
	printStatus,
	applyTemplate,
};
