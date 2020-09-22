const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const config = require('./config');
const development = require('./development');

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
