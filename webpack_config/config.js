'use strict';
const path = require('path');

const paths = {
  root: path.join(__dirname, '../'),
  src: path.join(__dirname, '../src'),
  vendor: path.join(__dirname, '../src/vendor'),
  output: path.join(__dirname, '../dist'),
  assets: path.join(__dirname, '../src/assets'),
  static: path.join(__dirname, '../static'),
  shared: path.join(__dirname, '../shared'),
  modules: path.join(__dirname, '../node_modules'),
  testConfig: path.join(__dirname, '../jest_config')
};

module.exports = {
  // Configuration
  port: 3000,
  title: 'MyCrypto - Ethereum Wallet Manager',
  // description < 200 characters
  description:
    'Securely manage ALL of your crypto accounts with MyCrypto. Swap, send, and buy crypto with your favorite wallets like Ledger, Metamask, and Trezor.',
  url: 'https://app.mycrypto.com/',
  type: 'website',
  // img < 5MB
  // image needs to be an absolute URL
  img: 'https://app.mycrypto.com/link-preview.png',
  twitter: {
    creator: '@MyCrypto'
  },
  path: paths,

  // Split vendor modules into seperate chunks for better caching.
  // 1. Multiple chunks are better than a single one. ie. The gain in caching outweighs
  //    the cost of multiple files.
  //    https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
  // 2. Separate pattern for cacheGroups:
  //    https://stackoverflow.com/questions/48985780/webpack-4-create-vendor-chunk
  chunks: {
    individual: [
      'ethers',
      'recharts',
      '@walletconnect',
      '@ledgerhq',
      '@unstoppabledomains',
      'graphql',
      'apollo-client'
    ],
    devOnly: []
  }
};
