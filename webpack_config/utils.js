'use strict';
const path = require('path');
const config = require('./config');

const _ = (module.exports = {});

_.cwd = file => {
  return path.join(process.cwd(), file || '');
};

_.outputPath = path.join(__dirname, '../dist');

_.outputIndexPath = path.join(__dirname, '../dist/index.html');

_.target = 'web';

_.loadersOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    minimize: isProd,
    debug: !isProd,
    options: {
      // css-loader relies on context
      context: process.cwd()
    }
  };
};
