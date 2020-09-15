import {
  IS_DEV as isDev,
  IS_ELECTRON as isElectron,
  IS_PROD as isProd,
  IS_STAGING as isStaging
} from '../../environment';

export const IS_DEV: boolean = isDev;
export const IS_PROD: boolean = isProd;

export const IS_STAGING: boolean = isStaging;
export const IS_ELECTRON: boolean = isElectron;

export const USE_HASH_ROUTER: boolean = IS_ELECTRON || IS_STAGING;

export const hasWeb3Provider = (): boolean => window && ('web3' in window || 'ethereum' in window);

// MigrateLS: loading an iframe in testcafe fails the same-origin policies. Set a flag to deactivate
// the feature when running with testcafe
export const IS_E2E = window && 'testcafe|request-barrier' in window;
