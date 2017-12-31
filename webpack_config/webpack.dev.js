'use strict';
process.env.NODE_ENV = 'development';
const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const config = require('./config');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const threadLoader = require('thread-loader');

const fullSourceMap = process.env.SLOW_BUILD_SPEED;
if (fullSourceMap) {
  base.devtool = fullSourceMap ? 'source-map' : 'cheap-module-eval-source-map';

  threadLoader.warmup(
    {
      // pool options, like passed to loader options
      // must match loader options to boot the correct pool
      happyPackMode: true,
      logLevel: 'info'
    },
    [
      // modules to load
      // can be any module, i. e.
      'ts-loader'
    ]
  );
  base.module.rules[0].use.unshift({
    loader: 'thread-loader',
    options: {
      workers: 4
    }
  });
}

base.performance = { hints: false };

base.module.rules.push(
  {
    test: /\.css$/,
    include: path.resolve(__dirname, '../common/vendor'),
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.scss$/,
    include: ['components', 'containers', 'sass']
      .map(dir => path.resolve(__dirname, `../common/${dir}`))
      .concat([path.resolve(__dirname, '../node_modules')]),

    exclude: /node_modules(?!\/font-awesome)/,
    use: ['style-loader', 'css-loader', 'sass-loader']
  },
  {
    test: /\.less$/,
    include: path.resolve(__dirname, '../common/assets/styles'),
    use: ['style-loader', 'css-loader', 'less-loader']
  }
);

base.plugins.push(
  new AutoDllPlugin({
    inject: true, // will inject the DLL bundles to index.html
    filename: '[name]_[hash].js',
    debug: true,
    context: path.join(__dirname, '..'),
    entry: {
      vendor: [...config.vendor, 'babel-polyfill', 'bootstrap-sass', 'font-awesome']
    }
  }),
  new HardSourceWebpackPlugin({
    environmentHash: {
      root: process.cwd(),
      directories: ['webpack_config'],
      files: ['package.json']
    }
  }),

  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new FriendlyErrors()
);

module.exports = base;
