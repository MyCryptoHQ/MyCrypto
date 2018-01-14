'use strict';
const webpack = require('webpack');
const path = require('path');
const config = require('./config');
const makeConfig = require('./makeConfig');

const electronConfig = {
  entry: './electron/main.js',
  target: 'electron-main',
  output: {
    filename: 'main.js',
    path: path.resolve(config.path.output, 'electron-js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
  node: {
    __dirname: false,
    __filename: false
  }
};

const jsConfig = makeConfig({
  isProduction: true,
  isElectronBuild: true,
  outputDir: 'electron-js'
});

module.exports = [jsConfig, electronConfig];
