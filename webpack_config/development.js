const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge');

const { LOCAL } = require('../environment');
const common = require('./common');
const config = require('./config');

const HTTP_PORT = 3000;

module.exports = merge.smart(common, {
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    historyApiFallback: true,
    progress: false,
    hot: true,
    https: true,
    port: HTTP_PORT,
    clientLogLevel: 'warning', // Silence [WDS] && [HMR] output in console
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    },
    stats: 'errors-only'
  },

  output: {
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [
          path.join(config.path.src, 'vendor'),
          path.join(config.path.root, 'node_modules/typeface-lato'),
          path.join(config.path.root, 'node_modules/rc-steps')
        ]
      },

      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      TARGET_ENV: process.env.TARGET_ENV || LOCAL
    }),

    new FriendlyErrorsPlugin({
      clearConsole: false
    }),

    new ReactRefreshWebpackPlugin(),
    // Analyse webpack bundle. Available at: http://localhost:8888
    // https://www.npmjs.com/package/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({ openAnalyzer: false }),

    // Make .env variables available to react code.
    // We use Github secrets for production, so this is only defined in development.
    new Dotenv({
      safe: true // loads .env.example to sure all values are defined in .env
    })
  ],

  performance: {
    hints: false
  }
});
