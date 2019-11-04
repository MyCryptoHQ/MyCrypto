import { Fiat } from 'config';

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
  toggleShowChart(): void;
}
