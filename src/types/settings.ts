import { IRates } from './rates';
import { TUuid } from './uuid';
import { TFiatTicker } from './asset';

export interface ISettings {
  fiatCurrency: TFiatTicker;
  darkMode: boolean;
  dashboardAccounts: TUuid[];
  excludedAssets: TUuid[];
  inactivityTimer: number;
  node?: string;
  rates: IRates;
  language: string; // @todo: Change to enum
}
