'use strict';

const
  assert = require('assert'),
  child = require('child_process'),
  path = require('path'),
  flavorsCommand = require('..'),
  cliPath = path.resolve(__dirname, '..', 'index.js');

function testPath(...names) {
  return path.resolve(__dirname, ...names);
}

function outputEquals(args, options, expected) {
  assert.strictEqual(child.execFileSync(`${cliPath}`, args, options).toString(), expected + '\n');
}

function options(dir, env = {}) {
  return {
    cwd: testPath(dir),
    env: Object.assign(process.env, env)
  };
}

describe('flavors-command', () => {
  it('uses options from flavors options file: ' + flavorsCommand.optionsFile, () => {
    outputEquals(['echo', '$value'], options('flavorsOptions'), '1');
  });

  it('uses options from local flavors options file: ' + flavorsCommand.localOptionsFile, () => {
    outputEquals(['echo', '$value1$value2'], options('localFlavorsOptions'), '12');
  });

  it('uses custom flavors options file', () => {
    const testName = 'customFlavorsOptions';
    outputEquals(['echo', '$value'], options(testName, {FLAVORS_OPTIONS_PATH: testPath(testName, testName + '.js')}), '1');
  });

  it('uses custom flavors local options file', () => {
    const testName = 'customFlavorsLocalOptions';
    outputEquals(['echo', '$value1$value2'], options(testName, {FLAVORS_LOCAL_OPTIONS_PATH: testPath(testName, 'customFlavorsOptions.local.js')}), '12');
  });

  it('uses custom flavors config name', () => {
    outputEquals(['echo', '$value'], options('customConfigName', {FLAVORS_CONFIG_NAME: 'custom'}), '1');
  });
});