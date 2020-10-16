import { IS_DEV, log } from '@utils';
// The root URL for Analytics API requests.
export const ANALYTICS_API_URL = IS_DEV
  ? 'http://localhost:5555'
  : 'https://analytics.proxy.mycryptoapi.com/';

// WriteKey for Segment API
export const ANALYTICS_WRITE_KEY = (() => {
  if (process.env.SEGMENT_WRITE_KEY) {
    return process.env.SEGMENT_WRITE_KEY;
  } else {
    log('Missing ANALYTICS_WRITE_KEY');
    return '';
  }
})();

// Analytics event category names
export enum ANALYTICS_CATEGORIES {
  HEADER = 'Header',
  FOOTER = 'Footer',
  SIDEBAR = 'Sidebar',
  ROOT = 'Root',
  DOWNLOAD_DESKTOP = 'Download Desktop App',
  HOME = 'Homepage',
  SCREEN_LOCK = 'Screen Lock',
  UPDATE_DESKTOP = 'Update Desktop App',
  NOTIFICATION = 'Notification',
  SETTINGS = 'Settings',
  WALLET_BREAKDOWN = 'Wallet breakdown',
  AD = 'Ad',
  TOKEN_SCANNER = 'Token Scanner',
  ADD_ACCOUNT = 'Add Account',
  ADD_WEB3_ACCOUNT = 'Add web3 account',
  SELECT_NETWORK = 'Select network',
  TX_HISTORY = 'Tx History',
  TX_STATUS = 'TX Status'
}
