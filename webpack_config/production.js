const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const common = require('./common');
const config = require('./config');

const IS_ELECTRON = process.env.IS_ELECTRON !== undefined;

module.exports = merge.smart(common, {
  mode: 'production',

  devtool: 'cheap-module-source-map',

  entry: {
    vendor: config.vendorModules
  },

  output: {
    path: path.join(config.path.output, 'prod'),
    filename: '[name].[contenthash].js',
    globalObject: undefined
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader'
        ]
      },

      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
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
    new MiniCSSExtractPlugin({
      filename: `[name].[contenthash].css`
    }),

    new FaviconsWebpackPlugin({
      logo: path.resolve(config.path.assets, 'images/favicon.png'),
      cacheDirectory: false, // Cache makes builds nondeterministic
      inject: true,
      prefix: 'common/assets/meta-[hash]',
      favicons: {
        appDescription: 'Ethereum web interface',
        display: 'standalone',
        theme_color: '#007896'
      }
    }),

    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: true
    }),

    new webpack.ProgressPlugin(),

    new webpack.EnvironmentPlugin({ NODE_ENV: 'production'})
  ],

  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    concatenateModules: false
  },

  performance: {
    hints: 'warning'
  },
});
