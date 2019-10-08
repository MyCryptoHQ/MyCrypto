import { IRates } from './rates';

export interface ISettings {
  fiatCurrency: string;
  darkMode: boolean;
  dashboardAccounts: string[];
  inactivityTimer: number;
  node?: string;
  rates: IRates;
}
