<div align="center">
  <a href="https://github.com/flavors-js/flavors-command">
    <img width="200" height="200" src="https://flavors-js.github.io/flavors/logo.svg">
  </a>
  <br>
  <br>

[![npm](https://img.shields.io/npm/v/flavors-command.svg)](https://www.npmjs.com/package/flavors-command)
[![Build Status](https://travis-ci.org/flavors-js/flavors-command.svg?branch=master)](https://travis-ci.org/flavors-js/flavors-command)
[![David](https://img.shields.io/david/flavors-js/flavors-command.svg)](https://david-dm.org/flavors-js/flavors-command)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Join the chat at https://gitter.im/flavors-js/flavors](https://badges.gitter.im/flavors-js/flavors.svg)](https://gitter.im/flavors-js/flavors?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
</div>

# flavors-command

Command loader and runner powered by [Flavors](https://github.com/flavors-js/flavors) configuration management library.<br>
It allows to load and run commands in the pre-configured environment.

## Install

```text
$ npm install --save-dev flavors-command
```

## Usage

### As module

```javascript
const options = {configName: 'myConfig', spawnOptions: {shell: true}};
require('flavors-command')(
  options,
  'echo', '$value1', '$value2' // command and arguments
);
```

#### `options` parameter

Options for [flavors-runner](https://github.com/flavors-js/flavors-runner#options) and [flavors](https://github.com/flavors-js/flavors-runner#options).

#### command and arguments parameters

Command to run and its arguments.

## Maintainers

- [@mxl](https://github.com/mxl)

## License

See the [LICENSE](https://github.com/flavors-js/flavors-command/blob/master/LICENSE) file for details.
