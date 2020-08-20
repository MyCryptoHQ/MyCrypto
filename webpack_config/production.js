const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('@lowb/preload-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const common = require('./common');
const config = require('./config');
const { PRODUCTION, ELECTRON } = require('../environment');

const TargetEnv = process.env.TARGET_ENV || PRODUCTION;

module.exports = merge.smart(common, {
  mode: 'production',

  devtool: 'cheap-module-source-map',

  output: {
    path: path.join(config.path.output, 'web'),
    filename: '[name].[contenthash].js',
    globalObject: undefined,
    publicPath: './'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader']
      },

      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              prependData: `$is-electron: ${TargetEnv === ELECTRON};`
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      'TARGET_ENV': TargetEnv
    }),

    new MiniCSSExtractPlugin({
      filename: `[name].[contenthash].css`
    }),

    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: true
    }),

    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.(woff|woff2)$/.test(entry)) return 'font';
        return 'script';
      },
      include: 'allAssets',
      fileWhitelist: [/Lato.*\.(woff|woff2)$/, /social-media.*\.(woff|woff2)$/]
    }),

    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'allAssets',
      fileWhitelist: [/\.worker\.js$/],
      crossorigin() {
        return 'anonymous';
      }
    }),

    new webpack.ProgressPlugin()
  ]
});
