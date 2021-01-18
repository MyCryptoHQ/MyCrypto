const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const STAGING = 'staging';
const LOCAL = 'local';

// also used be webpack so defined outside of React App
const IS_DEV = process.env.NODE_ENV === DEVELOPMENT;
const IS_PROD = process.env.NODE_ENV === PRODUCTION;
const IS_STAGING = process.env.TARGET_ENV === STAGING;

module.exports = {
  PRODUCTION,
  DEVELOPMENT,
  STAGING,
  LOCAL,

  IS_DEV,
  IS_PROD,
  IS_STAGING
};
