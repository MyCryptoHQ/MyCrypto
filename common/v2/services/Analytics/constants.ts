// The root URL for Analytics API requests.
export const ANALYTICS_API_URL = 'https://analytics.mycryptoapi.com/piwik.php';

// The ID of the analytic website.
export const ANALYTICS_ID_SITE = 4;

// Parameter required for tracking, must be set to 1.
export const ANALYTICS_REC = 1;

// Analytics event category names
export enum ANALYTICS_CATEGORIES {
  HEADER = 'Header',
  FOOTER = 'Footer',
  SIDEBAR = 'Sidebar',
  ROOT = 'Root'
}
