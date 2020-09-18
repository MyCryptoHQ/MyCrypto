import { Balance, Fiat, IAccount } from '@types';

export interface BalancesDetailProps {
  balances: Balance[];
  totalFiatValue: string;
  fiat: Fiat;
  accounts: IAccount[];
  selected: string[];
  toggleShowChart(): void;
}
