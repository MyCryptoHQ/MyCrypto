import { IRates } from './rates';
import { TUuid } from './uuid';

export interface ISettings {
  fiatCurrency: string;
  darkMode: boolean;
  dashboardAccounts: TUuid[];
  inactivityTimer: number;
  node?: string;
  rates: IRates;
  language: string; // Todo: Change to enum
}
