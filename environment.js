const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'prod';

const IS_STAGING = process.env.TARGET_ENV === 'staging';
const IS_ELECTRON = process.env.TARGET_ENV === 'electron';

module.exports = {
  IS_DEV,
  IS_PROD,
  IS_STAGING,
  IS_ELECTRON
}