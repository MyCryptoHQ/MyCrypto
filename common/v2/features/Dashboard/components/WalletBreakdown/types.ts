
import { ExtendedAccount, Fiat } from 'v2/types';

export interface Balance {
  name: string;
  amount: number;
  fiatValue: number;
  ticker: string;
  isOther?: boolean;
}

export interface WalletBreakdownProps {
  balances: Balance[];
  totalFiatValue: number;
  fiat: Fiat;
  accounts: ExtendedAccount[];
  selected: string[];
  toggleShowChart(): void;
}
