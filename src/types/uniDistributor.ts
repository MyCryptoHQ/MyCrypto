import { ABIFunc } from './abiFunc';

type uint256 = any;

export interface IUniDistributor {
  isClaimed: ABIFunc<{ index: uint256 }, { claimed: boolean }>;
}
