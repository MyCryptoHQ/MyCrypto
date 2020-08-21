import { IERC20 } from './erc20';
import { ABIFunc } from './abiFunc';

export interface IREPV2 extends IERC20 {
  migrateFromLegacyReputationToken: ABIFunc<{}>;
}
