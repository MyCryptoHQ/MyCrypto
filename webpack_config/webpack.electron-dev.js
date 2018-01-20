'use strict';
const webpack = require('webpack');
const path = require('path');
const ClearDistPlugin = require('./plugins/clearDist');
const config = require('./config');
const makeConfig = require('./makeConfig');

const electronConfig = {
  target: 'electron-main',
  entry: {
    main: path.join(config.path.electron, 'main/index.ts'),
    preload: path.join(config.path.electron, 'preload.ts')
  },
  module: {
    rules: [config.typescriptRule]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(config.path.output, 'electron-js')
  },
  plugins: [
    new ClearDistPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
  ],
  node: {
    __dirname: false,
    __filename: false
  }
};

module.exports = electronConfig;
