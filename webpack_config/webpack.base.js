'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');

const config = require('./config');
const _ = require('./utils');

const webpackConfig = {
  entry: {
    client: './common/index.tsx'
  },
  output: {
    path: _.outputPath,
    filename: '[name].js',
    publicPath: config.publicPath,
    crossOriginLoading: "anonymous"
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
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, '../common'),
        use: [{ loader: 'ts-loader', options: { happyPackMode: true, logLevel: 'info' } }],
        exclude: ['assets', 'sass', 'vendor', 'translations/lang']
          .map(dir => path.resolve(__dirname, `../common/${dir}`))
          .concat([path.resolve(__dirname, '../node_modules')])
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader'
      },
      {
        include: [
          path.resolve(__dirname, '../common/assets'),
          path.resolve(__dirname, '../node_modules')
        ],
        exclude: /node_modules(?!\/font-awesome)/,
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[path][name].[ext]?[hash:6]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optipng: {
                optimizationLevel: 4
              },
              gifsicle: {
                interlaced: false
              },
              mozjpeg: {
                quality: 80
              },
              svgo: {
                plugins: [{ removeViewBox: true }, { removeEmptyAttrs: false }, { sortAttrs: true }]
              }
            }
          }
        ]
      },
      {
        include: [
          path.resolve(__dirname, '../common/assets'),
          path.resolve(__dirname, '../node_modules')
        ],
        exclude: /node_modules(?!\/font-awesome)/,
        test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: true
    }),
    new HtmlWebpackPlugin({
      title: config.title,
      template: path.resolve(__dirname, '../common/index.html'),
      inject: true,
      filename: _.outputIndexPath
    }),
    new CopyWebpackPlugin([
      {
        from: _.cwd('./static'),
        // to the root of dist path
        to: './'
      }
    ]),

    new webpack.LoaderOptionsPlugin(_.loadersOptions())
  ],
  target: _.target
};
module.exports = webpackConfig;
