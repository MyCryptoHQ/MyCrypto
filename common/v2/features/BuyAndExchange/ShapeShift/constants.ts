// How often to ping the deposit status for a ShapeShift transaction.
export const SHAPESHIFT_STATUS_PING_RATE = 2000;

// How often to check for ShapeShift authorization.
export const SHAPESHIFT_AUTHORIZATION_CHECK_RATE = 2000;

// The emails that receive support requests.
export const SHAPESHIFT_SUPPORT_EMAILS = 'support@shapeshift.zendesk.com,support@mycrypto.com';

// A fake token for testing ShapeShift integration.
export const SHAPESHIFT_FAKE_TOKEN = 'abc123';

// Fake data for testing ShapeShift integration.
export const SHAPESHIFT_FAKE_DATA = {
  options: ['ETH', 'BTC'],
  pairHash: {
    ETH_BTC: {
      limit: 999,
      maxLimit: 1999,
      min: 1,
      minerFee: 0,
      pair: 'ETH_BTC',
      rate: 0.5
    },
    BTC_ETH: {
      limit: 999,
      maxLimit: 1999,
      min: 1,
      minerFee: 0,
      pair: 'ETH_BTC',
      rate: 0.5
    }
  },
  images: {
    ETH: 'https://placehold.it/50x50',
    BTC: 'https://placehold.it/50x50'
  }
};
