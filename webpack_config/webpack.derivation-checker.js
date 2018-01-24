// Compile derivation checker using the (mostly) same webpack config
'use strict';
const path = require('path');
const config = require('./config');

const derivationConfig = {
  target: 'node',
  entry: './common/derivation-checker.ts',
  output: {
    path: config.path.output,
    filename: 'derivation-checker.js'
  },
  module: {
    rules: [config.typescriptRule],
  },
  resolve: config.resolve,
};

module.exports = derivationConfig;
