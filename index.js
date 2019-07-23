#!/usr/bin/env node
'use strict';

module.exports = (flavorsOptions, ...commandAndArgs) => {
  let command = require('flavors')(flavorsOptions.configName,
    Object.assign({}, flavorsOptions, {configFileName: 'command'}));

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

  const child = require('flavors-runner')(require('deepmerge')(flavorsOptions, {
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

if (require.main === module) {
  const path = require('path'),
    localOptionsPath = process.env.FLAVORS_LOCAL_OPTIONS_PATH || path.resolve(process.cwd(), module.exports.localOptionsFile),
    optionsPath = process.env.FLAVORS_OPTIONS_PATH || path.resolve(process.cwd(), module.exports.optionsFile),
    localOptions = (() => {
      try {
        return require(localOptionsPath);
      } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') {
          throw e;
        }
      }
    })(),
    options = require(optionsPath),
    envOptions = {};

  if (process.env.FLAVORS_CONFIG_NAME) {
    envOptions.configName = process.env.FLAVORS_CONFIG_NAME;
  }
  module.exports(Object.assign(options, localOptions, envOptions));
}
