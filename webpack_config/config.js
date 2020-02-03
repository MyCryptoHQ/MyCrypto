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
  port: 3000,
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
    modules: [paths.src, paths.modules, paths.root],
    alias: {
      modernizr$: path.resolve(__dirname, '../.modernizrrc.js')
    }
  },

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
