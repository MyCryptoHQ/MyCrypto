import { IS_DEV, SEGMENT_WRITE_KEY } from '@utils';
// The root URL for Analytics API requests.
export const ANALYTICS_API_URL = IS_DEV ? 'http://localhost:5555' : 'https://stats.mycryptoapi.com';

// WriteKey for Segment API
export const ANALYTICS_WRITE_KEY = SEGMENT_WRITE_KEY || '';

// Analytic Events
export type TAnalyticEvents =
  | 'App Load'
  | 'Add Account'
  | 'Link clicked'
  | 'Donate clicked'
  | 'Newsletter subscription';
