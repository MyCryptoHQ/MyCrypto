import { ABIFunc } from './abiFunc';
import { IERC20 } from './erc20';

type uint256 = any;

export interface IGolemMigration extends IERC20 {
  migrate: ABIFunc<{ _value: uint256 }>;
}
