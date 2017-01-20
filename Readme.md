# Marmot (mrm) core utils

[![npm](https://img.shields.io/npm/v/mrm-core.svg)](https://www.npmjs.com/package/mrm-core)

Utilities to make tasks for [mrm](https://github.com/sapegin/mrm).

## Taks example

This task adds ESLint to your project:

```js
'use strict';

const { json, lines, install } = require('mrm-core');

const defaultTest = 'echo "Error: no test specified" && exit 1';
const packages = [
	'eslint',
	'eslint-config-tamia',
];

module.exports = function() {
	// .eslintrc
	const eslintrc = json('.eslintrc');
	if (!eslintrc.get('extends').startsWith('tamia')) {
		eslintrc
			.set('extends', 'tamia')
			.save()
		;
	}

	// .eslintignore
	const eslintignore = lines('.eslintignore');
	eslintignore
		.append('node_modules')
		.save()
	;

	// package.json
	const packageJson = json('package.json')
		.merge({
			scripts: {
				lint: 'eslint . --ext .js --fix',
			},
		})
	;

	// package.json: test command
	const test = packageJson.get('scripts.test');
	if (!test || test === defaultTest) {
		packageJson.set('scripts.test', 'npm run lint');
	}
	else if (!test.includes('lint')) {
		packageJson.set('scripts.test', `npm run lint && ${test}`);
	}

	packageJson.save();

	// package.json: dependencies
	if (!packageJson.get('dependencies.eslint-config-tamia')) {
		install(packages);
	}
};
module.exports.description = 'Adds ESLint with a custom preset';
```

Read more in [mrm’s docs](https://github.com/sapegin/mrm), and this talks is already included by default.

You can find [more examples here](https://github.com/sapegin/dotfiles/tree/master/mrm).

## Installation

```
npm install --save-dev mrm-core
```

## API

```js
const { ini, json, lines, markdown, template, yaml, install, MrmError } = require('mrm-core');
```

* Modules to work with files of different formats: `ini`, `json`, `lines`, `markdown`, `template`, `yaml`.
* Install Yarn/npm packages: `install`.
* Custom error class: `MrmError`.

## Changelog

The changelog can be found on the [Releases page](https://github.com/sapegin/mrm/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[mrm](http://sapegin.me) and [contributors](https://github.com/sapegin/mrm/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
