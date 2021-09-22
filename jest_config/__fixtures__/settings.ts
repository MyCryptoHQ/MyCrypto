import { ISettings, TFiatTicker, TUuid } from '@types';

export const fSettings: ISettings = {
  fiatCurrency: 'USD' as TFiatTicker,
  darkMode: false,
  dashboardAccounts: ['15d5e8f3-c595-5206-b5f3-86c180eb7119' as TUuid],
  excludedAssets: ['94201e82-3da9-5ec0-925c-2972030acde9' as TUuid],
  language: 'en',
  isDemoMode: false,
  canTrackProductAnalytics: true,
  analyticsUserID: ''
};
