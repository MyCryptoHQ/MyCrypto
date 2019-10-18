const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const DelayPlugin = require('./plugins/delay');
const electronMain = require('./electron-main.development');
const electronRender = require('./production');
const config = require('./config');

const main = merge.smart(electronMain, {
  mode: 'production',
  devtool: 'none',

  plugins: [
    new DelayPlugin(500)
  ],

  optimization: {
    minimize: false
  }
});

const render = merge.smart(electronRender, {
  target: 'electron-renderer',

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
      'BUILD_DOWNLOADABLE': 'true',
      'BUILD_ELECTRON': 'true'
    })
  ]
});

module.exports = [
  main,
  render
];
