'use strict';

// @TODO: Wait to node.js achieve harmony module.
const HookProcess = require('./HookProcess.js');

const path = require('path');

class ClientHook {
  constructor({ hookName='', cwd='' }) {
    this[Symbol.for('cwd')]= cwd;
    this[Symbol.for('hookName')]= hookName;
  }

  start() {
    let pluginNames = this[Symbol.for('getPluginNames')]();
    let cwd = this.getCwd();
    let hookProcess;

    this[Symbol.for('printCurrentHookLog')]();
    hookProcess = new HookProcess({ pluginNames, cwd });
    hookProcess.start();
  }

  getCwd() {
    return this[Symbol.for('cwd')];
  }

  getHookName() {
    return this[Symbol.for('hookName')];
  }

  [Symbol.for('getPluginNames')]() {
    const config = this[Symbol.for('getConfiguartion')](this.getCwd());
    let pluginNames = config[this.getHookName()] || [];

    // Remove duplicate elements.
    let pluginNameSet = new Set(pluginNames);
    pluginNames = [...pluginNameSet];
    return pluginNames;
  }

  [Symbol.for('getConfiguartion')]() {
    let config = require(path.join(this.getCwd(), 'clienthooks.js'));
    return config;
  }

  [Symbol.for('printCurrentHookLog')]() {
    let hookName = this.getHookName();

    console.log(`hookName => ${hookName}`);
  }
}

module.exports = ClientHook;