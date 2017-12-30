// Compile freezer using the (mostly) same webpack config
'use strict';
const baseConfig = require('./webpack.base');

const freezerConfig = Object.assign({}, baseConfig, {
  // Remove the cruft we don't need
  plugins: undefined,
  target: undefined,
  performance: undefined,
  module: {
    // Typescript loader    
    loaders: [baseConfig.module.rules[0]]
  },

  // Point at freezer, make sure it's setup to run in node
  target: 'node',
  entry: {
    'freezer': './common/freezer'
  }
});

module.exports = freezerConfig;
