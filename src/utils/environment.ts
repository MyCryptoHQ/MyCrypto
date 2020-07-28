export const IS_DEV: boolean = process.env.NODE_ENV === 'development';
export const IS_PROD: boolean = process.env.NODE_ENV === 'production';

export const IS_STAGING: boolean = process.env.TARGET_ENV === 'staging';
export const IS_ELECTRON: boolean = process.env.TARGET_ENV === 'electron';

export const hasWeb3Provider = (): boolean => window && ('web3' in window || 'ethereum' in window);
