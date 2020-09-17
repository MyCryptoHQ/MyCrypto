import { Fiat, IAccount, TAddress, TUuid } from '@types';

export interface BalanceDetailsTableProps {
  balances: Balance[];
  totalFiatValue: string;
  fiat: Fiat;
  accounts: IAccount[];
  selected: string[];
  createFirstButton({ uuid, key }: { uuid: TUuid; key: string }): JSX.Element;
}

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
}
