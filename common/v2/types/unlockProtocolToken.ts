import { ABIFunc } from './abiFunc';

type uint256 = any;
type address = any;

export interface IUNLOCKLOCK {
  keyExpirationTimestampFor: ABIFunc<{ _owner: address }, { timestamp: uint256 }>;

  // ERC 20 methods
  approve: ABIFunc<{ _spender: address; _value: uint256 }, { approved: boolean }>;
  balanceOf: ABIFunc<{ _owner: address }, { balance: uint256 }>;
  transfer: ABIFunc<{ _to: address; _value: uint256 }>;
  transferFrom: ABIFunc<{ _from: address; _to: address; _value: uint256 }>;
}
