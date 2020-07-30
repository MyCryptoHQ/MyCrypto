import {
  IS_DEV as isDev,
  IS_PROD as isProd,
  IS_STAGING as isStaging,
  IS_ELECTRON as isElectron
} from '../../environment';

export const IS_DEV: boolean = isDev;
export const IS_PROD: boolean = isProd;

export const IS_STAGING: boolean = isStaging;
export const IS_ELECTRON: boolean = isElectron;

export const USE_HASH_ROUTER: boolean = IS_ELECTRON || IS_STAGING;

export const hasWeb3Provider = (): boolean => window && ('web3' in window || 'ethereum' in window);
