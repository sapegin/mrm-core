# Marmot (mrm) core utils

[![npm](https://img.shields.io/npm/v/mrm-core.svg)](https://www.npmjs.com/package/mrm-core)
[![Build Status](https://travis-ci.org/sapegin/mrm-core.svg)](https://travis-ci.org/sapegin/mrm-core)
[![Codecov](https://codecov.io/gh/sapegin/mrm-core/branch/master/graph/badge.svg)](https://codecov.io/gh/sapegin/mrm-core)

Utilities to write codemods for config files (JSON, YAML, INI, Markdown, etc.). Can be used to make tasks for [mrm](https://github.com/sapegin/mrm).

## Example

Add ESLint to your project:

```js
const { json, lines, packageJson, install } = require('mrm-core');

module.exports = function(config) {
  const preset = config('preset', 'tamia');
  const packages = ['eslint', `eslint-config-${preset}`];

  // .eslintrc
  const eslintrc = json('.eslintrc');
  if (!eslintrc.get('extends').startsWith(preset)) {
    eslintrc.set('extends', preset).save();
  }

  // .eslintignore
  lines('.eslintignore').add('node_modules').save();

  // package.json
  const pkg = packageJson()
    .setScript('lint', 'eslint . --fix')
    .setScript('pretest', 'npm run line')
    .save();

  // Install dependencies
  install(packages);
};
module.exports.description = 'Adds ESLint with a custom preset';
```

Read more in [mrm’s docs](https://github.com/sapegin/mrm), and this talks is already included by default.

You can find [more examples here](https://github.com/sapegin/dotfiles/tree/master/mrm).

You don’t have to use mrm-core with mrm, you can run this tasks from your own code:

```js
const get = require('lodash/get');
const addEslint = require('./tasks/eslint');
const config = {
  preset: 'airbnb',
};
const getConfig = (prop, defaultValue) => get(config, prop, defaultValue);
addEslint(getConfig);
```

## Installation

```
npm install --save-dev mrm-core
```

## API

### Work with files

* Do not overwrite original files, .
* All functions (except getters) can be chained.
* `save()` will create file if it doesn’t exist or update it with new data.
* `save()` will write file to disk only if the new content is different from the original file.

#### JSON

API:

```js
const { json } = require('mrm-core')
const file = json('file name', { default: 'values' })
file.exists()  // File exists?
file.get()  // Return everything
file.get('key.subkey', 'default value')  // Return value with given address
file.set('key.subkey', 'value')  // Set value by given address
file.set({ key: value })  // Replace JSON with given object
file.unset('key.subkey')  // Remove value by given address
file.merge({ key: value })  // Merge JSON with given object
file.save()  // Save file
```

Example:

```js
json('.eslintrc')
  .merge({
    extends: 'eslint-config-recommended',
  })
  .save();
```

#### YAML

API:

```js
const { yaml } = require('mrm-core')
const file = yaml('file name', { default: 'values' })
file.exists()  // File exists?
file.get()  // Return everything
file.get('key.subkey', 'default value')  // Return value with given address
file.set('key.subkey', 'value')  // Set value by given address
file.set({ key: value })  // Replace JSON with given object
file.unset('key.subkey')  // Remove value by given address
file.merge({ key: value })  // Merge JSON with given object
file.save()  // Save file
```

Example:

```js
yaml('.travis.yml')
  .set('language', 'node_js')
  .set('node_js', [4, 6])
  .save();
```

#### INI

API:

```js
const { ini } = require('mrm-core')
const file = ini('file name', 'comment')
file.exists()  // File exists?
file.get()  // Return everything
file.get('section name')  // Return section value
file.set('section name', { key: value })  // Set section value
file.unset('section name')  // Remove section
file.save()  // Save file
```

Example:

```js
const { ini } = require('mrm-core');
ini('.editorconfig', 'editorconfig.org')
  .set('root', true)
  .set('*', {
    indent_style: 'tab',
    end_of_line: 'lf'
  })
  .save();
```

Result:

```ini
# editorconfig.org
root = true

[*]
indent_style = tab
end_of_line = lf
```

#### Plain text separated by new line

API:

```js
const { lines } = require('mrm-core')
const file = lines('file name', ['default', 'values'])
file.exists()  // File exists?
file.get()  // Return everything
file.add('new')  // Add new line
file.add(['new', 'lines'])  // Add multiple news lines
file.remove('new')  // Remove line
file.remove(['new', 'lines'])  // Remove multiple lines
file.save()  // Save file
```

Example:

```js
lines('.eslintignore')
  .add('node_modules')
  .save();
```

#### Markdown

**Note:** use `template` function to create Markdown files.

API:

```js
const { markdown } = require('mrm-core')
const file = markdown('file name')
file.exists()  // File exists?
file.get()  // Return file content
file.addBadge('image URL', 'link URL', 'alt text')  // Add a badge at the beginning of the file (below header)
file.save()  // Save file
```

Example:

```js
const name = 'pizza';
markdown('Readme.md')
  .addBadge(
    `https://travis-ci.org/${config('github')}/${name}.svg`,
    `https://travis-ci.org/${config('github')}/${name}`,
    'Build Status'
  )
  .save();
```

#### Plain text templates

Templates use ES6 [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax.

API:

```js
const { template } = require('mrm-core')
const file = template('file name', 'template file name')
file.exists()  // File exists?
file.get()  // Return file content
file.apply({ key: 'value' })  // Replace template tags with given values
file.save()  // Save file
```

Example:

```js
template('License.md', path.join(__dirname, 'License.md'))
  .apply(config(), {
    year: (new Date()).getFullYear(),
  })
  .save();
```

Template:

```
The MIT License
===============

Copyright ${year} ${name} (${url}), contributors

Permission is hereby granted, free of charge, to any person obtaining...
```

### Special files

#### package.json

API:

```js
const { packageJson } = require('mrm-core')
const file = packageJson({ default: 'values' })
file.exists()  // File exists?
file.get()  // Return everything
file.getScript('test')  // Return script
file.setScript('test', 'jest')  // Replace a script with a command: a -> b
file.appendScript('test', 'jest')  // Append command to a script: a -> a && b
file.prependScript('test', 'jest')  // Prepend a script with a command: a -> b && a
file.removeScript('test')  // Remove script
file.removeScript(/^mocha|ava$/)  // Remove all scripts that match a regexp
file.removeScript('test', /b/)  // Remove subcommands from a script: a && b -> a
file.save()  // Save file
// All methods of json() work too
```

Example:

```js
packageJson()
  .appendScript('lint', 'eslint . --ext .js --fix')
  .save();
```


### File system helpers

```js
const { copyFiles, makeDirs } = require('mrm-core')
copyFiles('source dir', 'file name') // Copy file
copyFiles('source dir', ['file name 1', 'file name 2']) // Copy files
copyFiles('source dir', 'file name', { overwrite: false }) // Do not overwrite
makeDirs('dir name') // Create folder
makeDirs(['dir name 1', 'dir name 2']) // Create folders
```

### Install and uninstall npm packages

Installs npm package(s) and saves them to `package.json` if they aren’t installed yet.

```js
const { install } = require('mrm-core')
install('eslint') // Install to devDependencies
install(['tamia', 'lodash'], { dev: false }) // Install to dependencies
```

Uninstalls npm package(s) and removes them from `package.json`:

```js
const { uninstall } = require('mrm-core')
uninstall('eslint') // Uninstall from devDependencies
uninstall(['tamia', 'lodash'], { dev: false }) // Uninstall from dependencies
```

### Custom error class: `MrmError`

Use this class to notify user about expected errors in your tasks. It will be printed without a stack trace and will abort task.

```js
const { MrmError } = require('mrm-core')
if (!fs.existsSync('.travis.yml')) {
  throw new MrmError('Run travis task first');
}
```

## Change log

The change log can be found on the [Releases page](https://github.com/sapegin/mrm/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Artem Sapegin](http://sapegin.me) and [contributors](https://github.com/sapegin/mrm/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
