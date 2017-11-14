'use strict';

module.exports = flavorsOptions => {
  let command = require('flavors')(flavorsOptions.configName,
    Object.assign({}, flavorsOptions, {configFileName: 'command'}));

  let argIndex = 2;
  for (; argIndex < process.argv.length && typeof command === 'object' && command.command === undefined; argIndex++) {
    command = command[process.argv[argIndex]];
  }

  const args = process.argv.slice(argIndex);

  if (typeof command === 'function') {
    command(...args);
  } else {
    if (command === undefined) {
      command = {
        command: process.argv[2],
        args: process.argv.slice(3)
      };
    } else {
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
    }


    const child = require('flavors-runner')(Object.assign({}, flavorsOptions, {
      command: {command},
      spawnOptions: {
        stdio: 'inherit'
      }
    }));

    // to make Ctrl-C work
    process.on('SIGINT', () => {
      child.kill('SIGINT');
    });
  }
};
