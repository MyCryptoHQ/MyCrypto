'use strict';
process.env.NODE_ENV = 'development';
const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base');
const FriendlyErrors = require('friendly-errors-webpack-plugin');

base.devtool = process.env.SLOW_BUILD_SPEED
  ? 'source-map'
  : 'cheap-module-eval-source-map';

base.module.loaders.push(
  {
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader']
  },
  {
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
  },
  {
    test: /\.less$/,
    loaders: ['style-loader', 'css-loader', 'less-loader']
  }
);

base.plugins.push(
  new webpack.DllReferencePlugin({
    context: path.join(__dirname, '../common'),
    manifest: require('../dll/vendor-manifest.json')
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new FriendlyErrors()
);

module.exports = base;
