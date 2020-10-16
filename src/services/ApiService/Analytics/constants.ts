import { IS_DEV } from '@utils';
// The root URL for Analytics API requests.
export const ANALYTICS_API_URL = IS_DEV
  ? 'http://localhost:5555'
  : 'https://analytics.proxy.mycryptoapi.com/';

// WriteKey for Segment API
export const ANALYTICS_WRITE_KEY = process.env.SEGMENT_WRITE_KEY || '';

// Analytic Events
export type TAnalyticEvents =
  | 'Header'
  | 'Footer'
  | 'Sidebar'
  | 'Root'
  | 'Download Desktop App'
  | 'Homepage'
  | 'Screen Lock'
  | 'Update Desktop App'
  | 'Notification'
  | 'Settings'
  | 'Wallet breakdown'
  | 'Ad'
  | 'Token Scanner'
  | 'Add Account'
  | 'Add web3 account'
  | 'Select network'
  | 'Tx History'
  | 'TX Status';
