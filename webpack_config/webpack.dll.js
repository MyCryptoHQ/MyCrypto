const path = require('path');
const webpack = require('webpack');
const config = require('./config');
const _ = require('./utils');

module.exports = {
  entry: {
    vendor: [path.join(__dirname, '../common', 'vendors.js')]
  },
  output: {
    path: path.join(__dirname, '../static'),
    filename: 'dll.[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dll', '[name]-manifest.json'),
      name: '[name]',
      context: path.resolve(__dirname, '../common')
    })
  ],
  resolve: {
    modules: [
      // places where to search for required modules
      'node_modules',
      config.srcPath,
      _.cwd('node_modules'),
      _.cwd('./')
    ]
  }
};
