import { TFiatTicker } from '@types';

export const defaultSettings = {
  fiatCurrency: 'USD' as TFiatTicker,
  darkMode: false,
  dashboardAccounts: [],
  excludedAssets: [],
  inactivityTimer: 1800000,
  rates: {},
  language: 'en',
  isDemoMode: false,
  canTrackProductAnalytics: true
};
