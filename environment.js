const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const STAGING = 'staging';
const ELECTRON = 'electron';
const LOCAL = 'local';

const IS_DEV = process.env.NODE_ENV === DEVELOPMENT;
const IS_PROD = process.env.NODE_ENV === PRODUCTION;

const IS_STAGING = process.env.TARGET_ENV === STAGING;
const IS_ELECTRON = process.env.TARGET_ENV === ELECTRON;

module.exports = {
  PRODUCTION,
  DEVELOPMENT,
  STAGING,
  ELECTRON,
  LOCAL,

  IS_DEV,
  IS_PROD,
  IS_STAGING,
  IS_ELECTRON
};
