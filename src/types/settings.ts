import { TFiatTicker } from './asset';
import { IRates } from './rates';
import { TUuid } from './uuid';

export interface ISettings {
  fiatCurrency: TFiatTicker;
  darkMode: boolean;
  dashboardAccounts: TUuid[];
  excludedAssets: TUuid[];
  inactivityTimer: number;
  node?: string;
  rates: IRates;
  language: string; // @todo: Change to enum
  isDemoMode: boolean;
  canTrackProductAnalytics: boolean;
}
