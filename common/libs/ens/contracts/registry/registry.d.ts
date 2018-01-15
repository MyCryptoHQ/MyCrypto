import { ABIFunc, ABIFuncParamless } from '../AbiFunc';

export interface IRegistry {
  resolver: ABIFunc<{ node: bytes32 }, { resolverAddress: address }>;
  owner: ABIFunc<{ node: bytes32 }, { ownerAddress: address }>;
  setSubnodeOwner: ABIFunc<{ node: bytes32; label: bytes32; owner: address }>;
  setTTL: ABIFunc<{ node: bytes32; ttl: uint64 }>;
  ttl: ABIFunc<{ node: bytes32 }, { timeToLive: uint64 }>;
  setResolver: ABIFunc<{ node: bytes32; resolver: address }>;
  setOwner: ABIFunc<{ node: bytes32; owner: address }>;
}

type bytes32 = any;
type address = any;
type uint64 = any;
