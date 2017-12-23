'use strict';
const path = require('path');

module.exports = {
  port: process.env.HTTPS ? 3443 : 3000,
  title: 'MEW',
  publicPath: process.env.BUILD_DOWNLOADABLE ? './' : '/',
  srcPath: path.join(__dirname, './../common'),
  // add these dependencies to a standalone vendor bundle
  vendor: [
    'react',
    'react-dom',
    'react-router',
    'redux',
    'react-router-redux',
    'redux-saga',
    'whatwg-fetch'
  ],
  // Settings for webpack-image-loader image compression
  imageCompressionOptions: {
    optipng: {
      optimizationLevel: 4
    },
    gifsicle: {
      interlaced: false
    },
    mozjpeg: {
      quality: 80
    },
    svgo: {
      plugins: [{ removeViewBox: true }, { removeEmptyAttrs: false }, { sortAttrs: true }]
    }
  }
};
