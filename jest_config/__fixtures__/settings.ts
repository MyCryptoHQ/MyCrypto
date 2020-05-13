import { TUuid, ISettings } from '@types';

export const fSettings: ISettings = {
  fiatCurrency: 'USD',
  darkMode: false,
  dashboardAccounts: ['4ffb0d4a-adf3-1990-5eb9-fe78e613f70b' as TUuid],
  inactivityTimer: 1800000,
  rates: {
    '92cfceb3-9d57-5914-ad8b-14d0e37643de': {
      usd: 195.04,
      eur: 179.88
    }
  },
  language: 'en'
};
