import { IAccount, Fiat, TAddress, TUuid } from '@types';

export interface BalanceAccount {
  address: TAddress;
  ticker: string;
  amount: number;
  fiatValue: number;
  label: string;
}

export interface Balance {
  id?: string;
  name: string;
  amount: number;
  fiatValue: number;
  ticker: string;
  isOther?: boolean;
  exchangeRate?: number;
  accounts?: BalanceAccount[];
  uuid?: TUuid;
}

export interface WalletBreakdownProps {
  balances: Balance[];
  totalFiatValue: number;
  fiat: Fiat;
  accounts: IAccount[];
  selected: string[];
  toggleShowChart(): void;
}
