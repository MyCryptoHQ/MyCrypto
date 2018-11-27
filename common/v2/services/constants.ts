import { ShapeShiftAssetWhitelistHash } from './types';

// How long should the APIService wait before abandoning a request?
export const API_SERVICE_TIMEOUT = 10000;

// These are the headers all request start with.
export const API_SERVICE_DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

// How long should fetches stay alive in cache?
export const CACHE_TIME_TO_LIVE = 1000 * 60 * 5;

// All tokens ShapeShift carries that MyCrypto agrees to support.
export const SHAPESHIFT_TOKEN_WHITELIST = [
  'OMG',
  'REP',
  'SNT',
  'SNGLS',
  'ZRX',
  'SWT',
  'ANT',
  'BAT',
  'BNT',
  'CVC',
  'DNT',
  '1ST',
  'GNO',
  'GNT',
  'EDG',
  'FUN',
  'RLC',
  'TRST',
  'GUP'
];

// All assets ShapeShift carries that MyCrypto agrees to support.
export const SHAPESHIFT_ASSET_WHITELIST = [
  ...SHAPESHIFT_TOKEN_WHITELIST,
  'ETH',
  'ETC',
  'BTC',
  'XMR'
];

export const SHAPESHIFT_ASSET_WHITELIST_HASH: ShapeShiftAssetWhitelistHash = SHAPESHIFT_ASSET_WHITELIST.reduce(
  (prev, next) => {
    prev[next] = true;
    return prev;
  },
  {} as ShapeShiftAssetWhitelistHash
);

export const SHAPESHIFT_API_URL = 'https://shapeshift.io';

export const SHAPESHIFT_ACCESS_TOKEN = 'c640aa85-dd01-4db1-a6f2-ed57e6fd6c54';

export const SHAPESHIFT_CLIENT_ID = 'fcbbb372-4221-4436-b345-024d91384652';

export const SHAPESHIFT_REDIRECT_URI = 'https://mycrypto.com/swap';

export const SHAPESHIFT_AUTHORIZATION_URL = 'https://auth.shapeshift.io/oauth/authorize';

export const SHAPESHIFT_TOKEN_PROXY_URL = 'https://proxy.mycryptoapi.com/request-shapeshift-token';
