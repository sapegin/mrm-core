// @ts-check
'use strict';

const path = require('path');
const editorconfig = require('editorconfig');
const findUp = require('find-up');
const detectIndent = require('detect-indent');
const readFile = require('./fs').readFile;

const EDITORCONFIG_FILE = '.editorconfig';
const TRAILING_NEW_LINE_REGEXP = /\r?\n$/;

/**
 * @typedef EditorConfigStyle
 * @property {'tab' | 'space' | 'unset'} [indent_style]
 * @property {number | 'tab' | 'unset'} [indent_size]
 * @property {true | false | 'unset'} [insert_final_newline]
 */

/**
 * Infer most common EditorConfig option by a file content.
 *
 * Supports: indent_style, indent_size, insert_final_newline
 *
 * @param {string} content
 * @return {EditorConfigStyle}
 */
function infer(content) {
	const style = {
		insert_final_newline: hasTrailingNewLine(content),
	};

	const indent = detectIndent(content);
	if (indent.type) {
		style.indent_style = indent.type;
		style.indent_size = indent.type === 'tab' ? 'tab' : indent.amount;
	}

	return style;
}

/**
 * Read EditorConfig for a given file.
 *
 * @param {string} filepath
 * @return {EditorConfigStyle}
 */
function read(filepath) {
	const editorconfigFile = findEditorConfig(filepath);
	if (editorconfigFile) {
		return editorconfig.parseFromFilesSync(filepath, [
			{ name: editorconfigFile, contents: readFile(editorconfigFile) },
		]);
	}

	return {};
}

/**
 * Reformat text according to a given EditorCofnig style.
 *
 * Suports: insert_final_newline
 *
 * @param {string} content
 * @param {EditorConfigStyle} style
 * @return {string}
 */
function format(content, style) {
	if (style.insert_final_newline !== undefined) {
		const has = hasTrailingNewLine(content);
		if (style.insert_final_newline && !has) {
			content += '\n';
		} else if (!style.insert_final_newline && has) {
			content = content.replace(TRAILING_NEW_LINE_REGEXP, '');
		}
	}

	return content;
}

/**
 * Find .editorconfig starting from a directory with a given file.
 *
 * @param {string} filepath
 * @return {string | null}
 */
function findEditorConfig(filepath) {
	return findUp.sync(EDITORCONFIG_FILE, { cwd: path.dirname(filepath) });
}

/**
 * Check is a string ends with a new line character.
 *
 * @param {string} string
 * @return {boolean}
 */
function hasTrailingNewLine(string) {
	return TRAILING_NEW_LINE_REGEXP.test(string);
}

/**
 * Get indentation string (e.g. '  ' or '\t') for a given EditorConfig style, default is two spaces.
 *
 * @param {EditorConfigStyle} style
 */
function getIndent(style) {
	if (style.indent_style === 'tab') {
		return '\t';
	}

	return ' '.repeat(Number(style.indent_size) || 2);
}

module.exports = {
	infer,
	read,
	format,
	findEditorConfig,
	hasTrailingNewLine,
	getIndent,
};
