import { TFiatTicker } from './asset';
import { TUuid } from './uuid';

export interface ISettings {
  fiatCurrency: TFiatTicker;
  darkMode: boolean;
  dashboardAccounts: TUuid[];
  excludedAssets: TUuid[];
  node?: string;
  language: string; // @todo: Change to enum
  isDemoMode: boolean;
  canTrackProductAnalytics: boolean;
  analyticsUserID: string;
}
