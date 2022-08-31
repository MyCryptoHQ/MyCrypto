import { TAddress, TUuid } from '@types';

export interface BalanceAccount {
  address: TAddress;
  ticker: string;
  amount: string;
  fiatValue: string;
  label: string;
}

export interface Balance {
  id?: string;
  name: string;
  amount: string;
  fiatValue: string;
  ticker: string;
  exchangeRate: string;
  isOther?: boolean;
  accounts?: BalanceAccount[];
  uuid?: TUuid;
  change?: number;
}
