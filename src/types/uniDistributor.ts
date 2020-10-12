import { ABIFunc } from './abiFunc';

type uint256 = any;
type address = any;
type bytes32Array = any;

export interface IUniDistributor {
  isClaimed: ABIFunc<{ index: uint256 }, { claimed: boolean }>;
  claim: ABIFunc<{ index: uint256; account: address; amount: uint256; merkleProof: bytes32Array }>;
}
