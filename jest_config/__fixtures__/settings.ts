import { TUuid, ISettings, TFiatTicker } from '@types';

export const fSettings: ISettings = {
  fiatCurrency: 'USD' as TFiatTicker,
  darkMode: false,
  dashboardAccounts: ['4ffb0d4a-adf3-1990-5eb9-fe78e613f70b' as TUuid],
  inactivityTimer: 1800000,
  excludedAssets: ['94201e82-3da9-5ec0-925c-2972030acde9' as TUuid],
  rates: {
    '92cfceb3-9d57-5914-ad8b-14d0e37643de': {
      usd: 195.04,
      eur: 179.88
    }
  },
  language: 'en'
};
