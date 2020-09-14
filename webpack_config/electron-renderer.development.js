const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const development = require('./development');
const config = require('./config');

module.exports = merge.smart(development, {
  output: {
    path: path.join(config.path.output, 'electron-js')
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      TARGET_ENV: 'electron'
    })
  ]
});
