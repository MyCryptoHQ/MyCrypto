import { ABIFunc, ABIFuncParamless } from '../AbiFunc';

export interface IResolver {
  supportsInterface: ABIFunc<{ interfaceID: bytes4 }, { doesSupportInterface: bool }>;
  addr: ABIFunc<{ node: bytes32 }, { ret: address }>;
  has: ABIFunc<{ node: bytes32; kind: bytes32 }, { has: bool }>;
  setAddr: ABIFunc<{ node: bytes32; addr: address }>;
  content: ABIFunc<{ node: bytes32 }, { ret: bytes32 }>;
  setContent: ABIFunc<{ node: bytes32; hash: bytes32 }>;
}

type bytes4 = any;
type bool = boolean;
type bytes32 = any;
type address = any;
