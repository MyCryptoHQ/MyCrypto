'use strict';
const webpack = require('webpack');
const path = require('path');
const config = require('./config');
const makeConfig = require('./makeConfig');

const DelayPlugin = function() {};
DelayPlugin.prototype.apply = function(compiler) {
  compiler.plugin('before-run', (compiler, done) => {
    setTimeout(() => {
      done();
    }, 500);
  });
};


const electronConfig = {
  target: 'electron-main',
  entry: {
    main: './electron/main.ts',
    preload: './electron/preload.ts'
  },
  module: {
    rules: [config.typescriptRule]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(config.path.output, 'electron-js')
  },
  plugins: [
    new DelayPlugin(),
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
  isProduction: process.env.NODE_ENV,
  isElectronBuild: true,
  outputDir: 'electron-js'
});

module.exports = [electronConfig, jsConfig];
