// How long should the APIService wait before abandoning a request?
export const API_SERVICE_TIMEOUT = 1000;

// These are the headers all request start with.
export const API_SERVICE_DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

// How long should fetches stay alive in cache?
export const CACHE_TIME_TO_LIVE = 1000 * 5;

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
