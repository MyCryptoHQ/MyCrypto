export const IS_DEV = process.env.NODE_ENV !== 'production';

export const IS_ELECTRON = process.env.BUILD_DOWNLOADABLE;

export const IS_MOBILE =
  window && window.navigator ? /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent) : false;
