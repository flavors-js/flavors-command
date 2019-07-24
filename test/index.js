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

function outputEquals(expected, args, dir, env = {}) {
  assert.strictEqual(child.execFileSync(`${cliPath}`, args, {
    cwd: testPath(dir),
    env: Object.assign({}, process.env, env)
  }).toString(), expected + '\n');
}

describe('flavors-command', () => {
  it('uses options from flavors options file: ' + flavorsCommand.optionsFile, () => {
    outputEquals('1', ['echo', '$value'], 'flavorsOptions');
  });

  it('uses options from local flavors options file: ' + flavorsCommand.localOptionsFile, () => {
    outputEquals('12', ['echo', '$value1$value2'], 'localFlavorsOptions');
  });

  it('uses custom flavors options file', () => {
    const testName = 'customFlavorsOptions';
    outputEquals('1', ['echo', '$value'], testName, {FLAVORS_OPTIONS_PATH: testPath(testName, testName + '.js')});
  });

  it('uses custom flavors local options file', () => {
    const testName = 'customFlavorsLocalOptions';
    outputEquals('12', ['echo', '$value1$value2'], testName, {FLAVORS_LOCAL_OPTIONS_PATH: testPath(testName, 'customFlavorsOptions.local.js')});
  });

  it('uses custom flavors config name', () => {
    outputEquals('1', ['echo', '$value'], 'customConfigName', {FLAVORS_CONFIG_NAME: 'custom'});
  });

  it('uses custom flavors options directory', () => {
    it('uses options from flavors options file', () => {
      const optionsDir = testPath('customFlavorsOptionsDir');
      outputEquals('1', ['echo', '$value'], '', {FLAVORS_OPTIONS_PATH: optionsDir, FLAVORS_LOCAL_OPTIONS_PATH: optionsDir});
    });
  });
});