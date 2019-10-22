import { ShapeShiftAssetWhitelistHash } from './types';

// The identifier to interact with CacheService.
export const SHAPESHIFT_CACHE_IDENTIFIER = 'ShapeShift';

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

// A dictionary form of ShapeShift assets, optimized for lookup speed.
export const SHAPESHIFT_ASSET_WHITELIST_HASH: ShapeShiftAssetWhitelistHash = SHAPESHIFT_ASSET_WHITELIST.reduce(
  (prev, next) => {
    prev[next] = true;
    return prev;
  },
  {} as ShapeShiftAssetWhitelistHash
);

// The root URL for ShapeShift API requests.
export const SHAPESHIFT_API_URL = 'https://shapeshift.io';

// The key in LocalStorage for ShapeShift credentials.
export const SHAPESHIFT_ACCESS_TOKEN = 'c640aa85-dd01-4db1-a6f2-ed57e6fd6c54';

// The ShapeShift ID unique to MyCrypto.
export const SHAPESHIFT_CLIENT_ID = 'fcbbb372-4221-4436-b345-024d91384652';

// The URI that ShapeShift redirects to post-authorization.
export const SHAPESHIFT_REDIRECT_URI = 'https://mycrypto.com/swap';

// The URL that a new window opens in for the ShapeShift authorization process.
export const SHAPESHIFT_AUTHORIZATION_URL = 'https://auth.shapeshift.io/oauth/authorize';

// The URL for MyCrypto's proxy to conserve secret information.
export const SHAPESHIFT_TOKEN_PROXY_URL = 'https://proxy.mycryptoapi.com/request-shapeshift-token';
