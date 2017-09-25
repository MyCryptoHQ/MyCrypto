// Compile derivation checker using the (mostly) same webpack config
'use strict';
const baseConfig = require('./webpack.base');

const derivationConfig = Object.assign({}, baseConfig, {
  // Remove the cruft we don't need
  plugins: undefined,
  target: undefined,
  performance: undefined,
  module: {
    // Typescript loader
    loaders: [baseConfig.module.loaders[0]]
  },

  // Point at derivation checker, make sure it's setup to run in node
  target: 'node',
  entry: {
    'derivation-checker': './common/derivation-checker.ts'
  }
});

module.exports = derivationConfig;
