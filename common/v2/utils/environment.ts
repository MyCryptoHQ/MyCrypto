export const IS_DEV: boolean = process.env.NODE_ENV === 'development';

export const IS_PROD: boolean = process.env.NODE_ENV === 'production';

export const HAS_WEB3_PROVIDER: boolean = window && 'web3' in window;
