import { ABIFunc, ABIFuncParamless } from './abiFunc';

type uint256 = any;
type address = any;

export interface IERC20 {
  decimals: ABIFuncParamless<{ decimals: string }>;
  symbol: ABIFuncParamless<{ symbol: string }>;

  approve: ABIFunc<{ _spender: address; _value: uint256 }, { approved: boolean }>;
  balanceOf: ABIFunc<{ _owner: address }, { balance: uint256 }>;
  transfer: ABIFunc<{ _to: address; _value: uint256 }>;
  transferFrom: ABIFunc<{ _from: address; _to: address; _value: uint256 }>;
  allowance: ABIFunc<{ _owner: address; _spender: address }, { allowance: uint256 }>;
}

export interface TokenInformation {
  readonly symbol?: string;
  readonly decimals?: number;
}
