import { IRates } from './rates';
import { TUuid } from './uuid';

export interface ISettings {
  fiatCurrency: string;
  darkMode: boolean;
  dashboardAccounts: TUuid[];
  excludedAssets: TUuid[];
  inactivityTimer: number;
  node?: string;
  rates: IRates;
  language: string; // @todo: Change to enum
}
