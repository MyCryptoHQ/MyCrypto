const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const common = require('./common');
const config = require('./config');

const HTTP_PORT = 3000;
const IS_ELECTRON = !!process.env.BUILD_ELECTRON;

module.exports = merge.smart(common, {
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    historyApiFallback: true,
    progress: false,
    hot: true,
    https: !IS_ELECTRON,
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

  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom' }
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [
          path.join(config.path.src, 'vendor'),
          path.join(config.path.root, 'node_modules/typeface-lato')
        ]
      },

      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              prependData: `$is-electron: ${IS_ELECTRON};`
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new FriendlyErrorsPlugin({
      clearConsole: false
    }),

    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),

    new webpack.HotModuleReplacementPlugin()
  ]
});
