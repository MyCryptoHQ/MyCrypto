import { ABIFunc } from './abiFunc';
import { IERC20 } from './erc20';

export interface IREPV2 extends IERC20 {
  migrateFromLegacyReputationToken: ABIFunc<TObject>;
}
