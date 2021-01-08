import { IS_DEV } from '@utils';
// The root URL for Analytics API requests.
export const ANALYTICS_API_URL = IS_DEV ? 'http://localhost:5555' : 'https://stats.mycryptoapi.com';

// WriteKey for Segment API
export const ANALYTICS_WRITE_KEY = process.env.SEGMENT_WRITE_KEY || '';

// Analytic Events
export type TAnalyticEvents =
  | 'App Load'
  | 'Add Account'
  | 'Link clicked'
  | 'Donate clicked'
  | 'Newsletter subscription';
