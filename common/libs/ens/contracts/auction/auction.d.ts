import { ABIFunc, ABIFuncParamless } from '../AbiFunc';
export interface IAuction {
  releaseDeed: ABIFunc<{ _hash: bytes32 }>;
  getAllowedTime: ABIFunc<{ _hash: bytes32 }, { timestamp: uint256 }>;
  invalidateName: ABIFunc<{ unhashedName: string }>;
  shaBid: ABIFunc<
    { hash: bytes32; owner: address; value: uint256; salt: bytes32 },
    { sealedBid: bytes32 }
  >;
  cancelBid: ABIFunc<{ bidder: address; seal: bytes32 }>;
  entries: ABIFunc<
    { _hash: bytes32 },
    {
      mode: uint8;
      deedAddress: address;
      registrationDate: uint256;
      value: uint256;
      highestBid: uint256;
    }
  >;
  ens: ABIFuncParamless<{ ensAddress: address }>;
  unsealBid: ABIFunc<{ _hash: bytes32; _value: uint256; _salt: bytes32 }>;
  transferRegistrars: ABIFunc<{ _hash: bytes32 }>;
  sealedBids: ABIFunc<{ address_0: address; bytes32_1: bytes32 }, { deedAddress: address }>;
  state: ABIFunc<{ _hash: bytes32 }, { state: uint8 }>;
  transfer: ABIFunc<{ _hash: bytes32; newOwner: address }>;
  isAllowed: ABIFunc<{ _hash: bytes32; _timestamp: uint256 }, { allowed: bool }>;
  finalizeAuction: ABIFunc<{ _hash: bytes32 }>;
  registryStarted: ABIFuncParamless<{ registryStartDate: uint256 }>;
  launchLength: ABIFuncParamless<{ launchLength: uint32 }>;
  newBid: ABIFunc<{ sealedBid: bytes32 }>;
  eraseNode: ABIFunc<{ labels: bytes32[] }>;
  startAuctions: ABIFunc<{ _hashes: bytes32[] }>;
  acceptRegistrarTransfer: ABIFunc<{
    hash: bytes32;
    deed: address;
    registrationDate: uint256;
  }>;
  startAuction: ABIFunc<{ _hash: bytes32 }>;
  rootNode: ABIFuncParamless<{ rootNode: bytes32 }>;
  startAuctionsAndBid: ABIFunc<{ hashes: bytes32[]; sealedBid: bytes32 }>;
}

type bytes32 = any;
type uint256 = any;
type address = any;
type uint8 = any;
type bool = boolean;
type uint32 = any;
