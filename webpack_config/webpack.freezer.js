// Compile freezer using the (mostly) same webpack config
'use strict';
const path = require('path');
const config = require('./config');

const freezerConfig = {
  target: 'node',
  mode: 'development',
  entry: './common/freezer',
  output: {
    path: config.path.output,
    filename: 'freezer.js'
  },
  module: {
    rules: [config.typescriptRule],
  },
  resolve: config.resolve,
};

module.exports = freezerConfig;
