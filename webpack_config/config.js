'use strict';
const path = require('path');

module.exports = {
  port: process.env.HTTPS ? 3443 : 3000,
  title: 'MEW',
  publicPath: process.env.BUILD_DOWNLOADABLE ? './' : '/',
  srcPath: path.join(__dirname, './../common'),
  // add these dependencies to a standalone vendor bundle
  vendor: [
    'bip39',
    'bn.js',
    'classnames',
    'ethereum-blockies',
    'ethereumjs-abi',
    'ethereumjs-tx',
    'ethereumjs-util',
    'ethereumjs-wallet',
    'hdkey',
    'idna-uts46',
    'jsonschema',
    'lodash',
    'moment',
    'normalizr',
    'qrcode',
    'qrcode.react',
    'query-string',
    'react',
    'react-dom',
    'react-markdown',
    'react-redux',
    'react-router-dom',
    'react-router-redux',
    'react-transition-group',
    'redux',
    'redux-logger',
    'redux-promise-middleware',
    'redux-saga',
    'scryptsy',
    'store2',
    'uuid',
    'wallet-address-validator',
    'whatwg-fetch'
  ]
};
