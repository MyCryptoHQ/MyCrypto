'use strict';
const webpack = require('webpack');
const path = require('path');
const ClearDistPlugin = require('./plugins/clearDist');
const DelayPlugin = require('./plugins/delay');
const makeConfig = require('./makeConfig');
const electronConfig = require('./webpack.electron-dev.js');

const jsConfig = makeConfig({
  isProduction: true,
  isElectronBuild: true,
  outputDir: 'electron-js'
});

// Redefine plugins with prod specific stuff
electronConfig.mode = 'production';

electronConfig.plugins = [
  new ClearDistPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new DelayPlugin(500)
];

module.exports = [electronConfig, jsConfig];
