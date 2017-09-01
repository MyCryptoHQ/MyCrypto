'use strict';
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const base = require('./webpack.base');
const FriendlyErrors = require('friendly-errors-webpack-plugin');

base.devtool = 'source-map';
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
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new FriendlyErrors()
);

module.exports = base;
