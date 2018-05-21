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
  modules: path.join(__dirname, '../node_modules')
};

module.exports = {
  // Configuration
  port: process.env.HTTPS ? 3443 : 3000,
  title: 'MyCrypto',
  // description < 200 characters
  description: 'MyCrypto is a free, open-source interface for interacting with the blockchain.',
  url: 'https://mycrypto.com/',
  type: 'website',
  // img < 5MB
  img: path.join(paths.assets, 'images/link-preview.png'),
  twitter: {
    creator: '@MyCrypto'
  },
  path: paths,

  // Typescript rule config
  typescriptRule: {
    test: /\.(ts|tsx)$/,
    include: [paths.src, paths.shared, paths.electron],
    use: [{ loader: 'ts-loader', options: { happyPackMode: true, logLevel: 'info' } }],
    exclude: ['assets', 'sass', 'vendor', 'translations/lang']
      .map(dir => path.resolve(paths.src, dir))
      .concat([paths.modules])
  },

  // File resolution
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.json', '.scss'],
    modules: [paths.src, paths.modules, paths.root]
  },

  // Vendor modules
  vendorModules: [
    'bip39',
    'bn.js',
    'classnames',
    'ethereum-blockies-base64',
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
    'redux-saga',
    'scryptsy',
    'uuid',
    'wallet-address-validator',
    'whatwg-fetch'
  ]
};
