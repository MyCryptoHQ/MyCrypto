// The root URL for Analytics API requests.
export const ANALYTICS_API_URL = 'https://analytics.proxy.mycryptoapi.com/';

// The ID of the analytic website.
export const ANALYTICS_ID_SITE = 4; // ID could also be 7?
export const ANALYTICS_ID_DESKTOP = 8;
export const ANALYTICS_ID_DESKTOP_DEV = 11;

// Parameter required for tracking, must be set to 1.
export const ANALYTICS_REC = 1;

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
  TX_HISTORY = 'Tx History'
}

/* Previous Params from 'develop'
  // The root URL for Analytics API requests.
  export const ANALYTICS_API_URL = 'https://analytics.proxy.mycryptoapi.com/';

  // The ID of the analytics.
  export const ANALYTICS_ID_SITE = 7;
  export const ANALYTICS_ID_DESKTOP = 8;
*/
