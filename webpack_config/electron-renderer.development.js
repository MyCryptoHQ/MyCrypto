const webpack = require('webpack');
const merge = require('webpack-merge');
const development = require('./development');

module.exports = merge.smart(development, {
  plugins: [
    new webpack.EnvironmentPlugin({
      'BUILD_DOWNLOADABLE': 'true',
      'BUILD_ELECTRON': 'true'
    })
  ]
});
