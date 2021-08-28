import { IS_DEV as isDev, IS_PROD as isProd, IS_STAGING as isStaging } from '../../environment';

export const COMMIT_HASH = process.env.COMMIT_HASH;

export const IS_DEV: boolean = isDev;
export const IS_PROD: boolean = isProd;
export const IS_STAGING: boolean = isStaging;

export const USE_HASH_ROUTER: boolean = IS_STAGING;

export const hasWeb3Provider = (): boolean => window && ('web3' in window || 'ethereum' in window);

// Set a flag to recognize when the app is run by testcafe.
// Usefull for extreme cases such as the sunset MigrateLS
export const IS_E2E = window && 'testcafe|request-barrier' in window;
