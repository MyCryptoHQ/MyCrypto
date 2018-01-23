'use strict';
const makeConfig = require('./makeConfig');

module.exports = makeConfig({
  isProduction: true,
  outputDir: 'prod'
});
