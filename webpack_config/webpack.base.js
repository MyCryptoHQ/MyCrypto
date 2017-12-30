'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const config = require('./config');
const _ = require('./utils');
const { CheckerPlugin } = require('awesome-typescript-loader');
module.exports = {
  entry: {
    client: './common/index.tsx'
  },
  output: {
    path: _.outputPath,
    filename: '[name].js',
    publicPath: config.publicPath
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
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
        loaders: [
          { loader: 'cache-loader' },
          {
            loader: 'awesome-typescript-loader'
          }
        ],
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
    new webpack.DefinePlugin({
      'process.env.BUILD_DOWNLOADABLE': JSON.stringify(!!process.env.BUILD_DOWNLOADABLE)
    }),
    new HtmlWebpackPlugin({
      title: config.title,
      template: path.resolve(__dirname, '../common/index.html'),
      filename: _.outputIndexPath
    }),
    new HtmlWebpackIncludeAssetsPlugin({ assets: ['dll.vendor.js'], append: false }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, '../static/favicon/android-chrome-384x384.png'),
      background: '#163151'
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
