import { TFiatTicker } from '@types';

export const defaultSettings = {
  fiatCurrency: 'USD' as TFiatTicker,
  darkMode: false,
  dashboardAccounts: [],
  excludedAssets: [],
  inactivityTimer: 1800000,
  language: 'en',
  isDemoMode: false,
  canTrackProductAnalytics: true
};
