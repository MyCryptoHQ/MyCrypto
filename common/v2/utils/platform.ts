export const IS_ELECTRON: boolean = !!process.env.BUILD_ELECTRON;

export const IS_DOWNLOADABLE: boolean = !!process.env.BUILD_DOWNLOADABLE;

export const IS_MOBILE: boolean =
  window && window.navigator ? /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent) : false;
