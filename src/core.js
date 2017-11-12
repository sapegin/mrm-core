// @ts-check
'use strict';

const fs = require('fs-extra');
const vm = require('vm');
const codeFrame = require('babel-code-frame');
const readFile = require('./fs').readFile;
const MrmError = require('./error');

/** Expand template using given object as a context */
function applyTemplate(templateFile, context) {
	if (!fs.existsSync(templateFile)) {
		throw Error(`Template file not found: ${templateFile}`);
	}

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
	applyTemplate,
};
