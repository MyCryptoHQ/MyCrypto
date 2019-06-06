const webpack = require('webpack');
const path = require('path');

const config = require('./config');
const ClearDistPlugin = require('./plugins/clearDist');

// Transpile the files that are needed by the electron main process.
const electronMainConfig = {
  target: 'electron-main',
  mode: 'development',
  entry: {
    main: path.join(config.path.electron, 'main/index.ts'),
    preload: path.join(config.path.electron, 'preload/index.ts')
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [
          config.path.src,
          config.path.shared,
          config.path.electron
        ],
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          }
        }],
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: config.resolve.modules
  },
  output: {
    filename: '[name].js',
    path: path.resolve(config.path.output, 'electron-js')
  },
  plugins: [
    new ClearDistPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  devtool: 'eval'
};

module.exports = electronMainConfig;
