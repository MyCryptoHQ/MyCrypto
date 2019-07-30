export interface Balance {
  name: string;
  amount: number;
  fiatValue: number;
  ticker: string;
  isOther?: boolean;
}

export interface Fiat {
  name: string;
  symbol: string;
}

export interface WalletBreakdownProps {
  balances: Balance[];
  totalFiatValue: number;
  fiat: Fiat;
  toggleShowChart(): void;
}
