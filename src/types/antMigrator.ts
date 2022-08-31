import { ABIFunc } from './abiFunc';

type uint256 = any;

export interface IAntMigrator {
  migrate: ABIFunc<{ _amount: uint256 }>;
}
