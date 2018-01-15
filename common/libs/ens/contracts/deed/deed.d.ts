import { ABIFunc, ABIFuncParamless } from '../AbiFunc';

export interface IDeed {
  creationDate: ABIFuncParamless<{ creationDate: uint256 }>;
  destroyDeed: ABIFuncParamless;
  setOwner: ABIFunc<{ newOwner: address }>;
  registrar: ABIFuncParamless<{ registrarAddress: address }>;
  owner: ABIFuncParamless<{ ownerAddress: address }>;
  closeDeed: ABIFunc<{ refundRatio: uint256 }>;
  setRegistrar: ABIFunc<{ newRegistrar: address }>;
  setBalance: ABIFunc<{ newValue: uint256 }>;
}
type uint256 = any;
type address = any;
