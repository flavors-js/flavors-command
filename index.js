#!/usr/bin/env node
'use strict';

const merge = require('deepmerge');

module.exports = (flavorsOptions, ...commandAndArgs) => {
  let command = require('flavors')(flavorsOptions.configName,
    merge.all([flavorsOptions, {configFileName: 'command'}]));

  if (commandAndArgs.length === 0) {
    commandAndArgs = process.argv.slice(2);
  }

  let argIndex = 0;
  for (; argIndex < commandAndArgs.length && typeof command === 'object' && command.command === undefined; argIndex++) {
    command = command[commandAndArgs[argIndex]];
  }

  const args = commandAndArgs.slice(argIndex);

  if (typeof command === 'function') {
    command = command(...args);
    if (command === undefined || command.command === undefined) {
      return;
    }
  }

  if (command) {
    if (typeof command === 'object' && typeof command.command === 'function') {
      command = command.command;
    } else if (args.length > 0) {
      if (typeof command === 'string') {
        command = {
          command,
          args
        };
      } else if (typeof command === 'object') {
        command.args = command.args || [];
        command.args.push(...args);
      }
    }
  } else {
    command = {
      command: commandAndArgs[0],
      args: commandAndArgs.slice(1)
    };
  }

  const child = require('flavors-runner')(merge(flavorsOptions, {
    command: {command},
    spawnOptions: {
      stdio: 'inherit'
    }
  }));

  // to make Ctrl-C work
  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });
};

module.exports.optionsFile = 'flavorsOptions.js';
module.exports.localOptionsFile = 'flavorsOptions.local.js';

if (require.main !== module) {
  return;
}

// eslint-disable-next-line no-inner-declarations
function resolveOptionsPath(customPath, optionsFile) {
  return customPath
    ? (customPath.endsWith('.js')
      ? customPath
      : path.resolve(customPath, optionsFile))
    : path.resolve(process.cwd(), optionsFile);
}

const path = require('path'),
  localOptionsPath = resolveOptionsPath(process.env.FLAVORS_LOCAL_OPTIONS_PATH, module.exports.localOptionsFile),
  optionsPath = resolveOptionsPath(process.env.FLAVORS_OPTIONS_PATH, module.exports.optionsFile),
  localOptions = (() => {
    try {
      return require(localOptionsPath);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }
    }
    return {};
  })(),
  options = require(optionsPath),
  envOptions = {};

if (process.env.FLAVORS_CONFIG_NAME) {
  envOptions.configName = process.env.FLAVORS_CONFIG_NAME;
}

const o = merge.all([options, localOptions, envOptions]);
module.exports(o);
