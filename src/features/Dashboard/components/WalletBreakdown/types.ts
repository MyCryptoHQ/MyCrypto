import { Balance, Fiat, IAccount } from '@types';

export interface BalancesDetailProps {
  balances: Balance[];
  totalFiatValue: number;
  fiat: Fiat;
  accounts: IAccount[];
  selected: string[];
  toggleShowChart(): void;
}
