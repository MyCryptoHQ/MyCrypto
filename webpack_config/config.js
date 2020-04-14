'use strict';
const path = require('path');

const paths = {
  root: path.join(__dirname, '../'),
  src: path.join(__dirname, '../common'),
  output: path.join(__dirname, '../dist'),
  assets: path.join(__dirname, '../common/assets'),
  static: path.join(__dirname, '../static'),
  electron: path.join(__dirname, '../electron-app'),
  shared: path.join(__dirname, '../shared'),
  modules: path.join(__dirname, '../node_modules'),
  testConfig: path.join(__dirname, '../jest_config')
};

module.exports = {
  // Configuration
  port: 3000,
  title: 'MyCrypto',
  // description < 200 characters
  description: 'MyCrypto is a free, open-source interface for interacting with the blockchain.',
  url: 'https://mycrypto.com/',
  type: 'website',
  // img < 5MB
  // image needs to be an absolute URL
  img: 'https://beta.mycrypto.com/link-preview.png',
  twitter: {
    creator: '@MyCrypto'
  },
  path: paths,

  // Vendor modules
  vendorModules: [
    'bip39',
    'bn.js',
    'classnames',
    'ethereumjs-abi',
    'ethereumjs-tx',
    'ethereumjs-util',
    'ethereumjs-wallet',
    'hdkey',
    'idna-uts46',
    'jsonschema',
    'lodash',
    'moment',
    'qrcode',
    'query-string',
    'react',
    'react-dom',
    'react-markdown',
    'react-router-dom',
    'react-transition-group',
    'uuid',
    'wallet-address-validator',
    'whatwg-fetch'
  ]
};
