'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./config');
const _ = require('./utils');
const AutoDllPlugin = require('autodll-webpack-plugin');
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const dllPlugin = new AutoDllPlugin({
  inject: true, // will inject the DLL bundles to index.html
  filename: '[name]_[hash].js',
  debug: true,
  context: path.join(__dirname, '..'),
  entry: {
    vendor: [
      'babel-polyfill',
      'bip39',
      'bn.js',
      'bootstrap-sass',
      'classnames',
      'ethereum-blockies',
      'ethereumjs-abi',
      'ethereumjs-tx',
      'ethereumjs-util',
      'ethereumjs-wallet',
      'font-awesome',
      'hdkey',
      'idna-uts46',
      'jsonschema',
      'lodash',
      'moment',
      'normalizr',
      'qrcode',
      'qrcode.react',
      'query-string',
      'react',
      'react-dom',
      'react-markdown',
      'react-redux',
      'react-router-dom',
      'react-router-redux',
      'react-transition-group',
      'redux',
      'redux-logger',
      'redux-promise-middleware',
      'redux-saga',
      'scryptsy',
      'store2',
      'uuid',
      'wallet-address-validator',
      'whatwg-fetch'
    ]
  }
});

const webpackConfig = {
  entry: {
    client: './common/index.tsx'
  },
  output: {
    path: _.outputPath,
    filename: '[name].js',
    publicPath: config.publicPath
  },
  performance: {
    hints: isProd ? 'warning' : false
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.json', '.scss', '.less'],
    modules: [
      // places where to search for required modules
      config.srcPath,
      _.cwd('node_modules'),
      _.cwd('./')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'awesome-typescript-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          {
            loader: 'file-loader',
            query: {
              hash: 'sha512',
              digest: 'hex',
              name: '[path][name].[ext]?[hash:6]'
            }
          },
          {
            loader: 'image-webpack-loader',
            query: config.imageCompressionOptions
          }
        ]
      },
      {
        test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title,
      template: path.resolve(__dirname, '../common/index.html'),
      inject: !isProd,
      filename: _.outputIndexPath
    }),
    new HardSourceWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.BUILD_GH_PAGES': JSON.stringify(!!process.env.BUILD_GH_PAGES)
    }),
    new webpack.LoaderOptionsPlugin(_.loadersOptions()),
    new CopyWebpackPlugin([
      {
        from: _.cwd('./static'),
        // to the root of dist path
        to: './'
      }
    ])
  ],
  target: _.target
};

if (!isProd) {
  webpackConfig.plugins.unshift(dllPlugin);
}

module.exports = webpackConfig;
