const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const { ELECTRON } = require('../environment');
const config = require('./config');
const electronMain = require('./electron-main.development');
const DelayPlugin = require('./plugins/delay');
const electronRender = require('./production');

const main = merge.smart(electronMain, {
  mode: 'production',
  devtool: 'none',

  plugins: [new DelayPlugin(500)],

  optimization: {
    minimize: false
  }
});

const render = merge.smart(electronRender, {
  target: 'web', // 'web' generates bundle that does not use Node.js functions (require, Buffer...) which would cause error when 'nodeIntegration' is disabled. (https://webpack.js.org/configuration/target/)

  output: {
    path: path.join(config.path.output, 'electron-js'),
    publicPath: './'
  },

  plugins: [
    new webpack.ExternalsPlugin('commonjs', [
      'desktop-capturer',
      'electron',
      'ipc',
      'ipc-renderer',
      'remote',
      'web-frame',
      'clipboard',
      'crash-reporter',
      'native-image',
      'screen',
      'shell'
    ]),

    new webpack.EnvironmentPlugin({
      TARGET_ENV: ELECTRON
    })
  ]
});

module.exports = [main, render];
