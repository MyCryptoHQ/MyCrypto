const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('./config');

module.exports = {
  target: 'electron-main',
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: {
    main: path.join(config.path.electron, 'main/index.ts'),
    preload: path.join(config.path.electron, 'preload/index.ts')
  },

  output: {
    filename: '[name].js',
    path: path.join(config.path.output, 'electron-main')
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [
      config.path.src,
      config.path.modules,
      config.path.root
    ]
  },

  module: {
    rules: [
      /**
       * TypeScript files
       */
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            }
          }
        ],
        include: [
          config.path.src,
          config.path.shared,
          config.path.electron
        ],
        exclude: /node_modules/,
      },

      /**
       * HTML files
       */
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),

    new webpack.EnvironmentPlugin({
      'NODE_ENV': 'development'
    })
  ],

  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb'
  },

  node: {
    __dirname: false,
    __filename: false
  }
};
