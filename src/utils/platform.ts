export const IS_ELECTRON: boolean = !!process.env.BUILD_ELECTRON;

export const IS_STAGING: boolean = 'mycryptobuilds.com' === location.host.replace('www.', '');
