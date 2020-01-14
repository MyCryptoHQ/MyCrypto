import { Contract, StoreAccount, ITxConfig, ITxReceipt, Network } from 'v2/types';

export enum ABIItemType {
  FUNCTION = 'function',
  EVENT = 'event',
  CONSTRUCTOR = 'constructor'
}

// TODO: Add remaining types / use string insteand of enum
export enum ABIFieldType {
  STRING = 'string',
  BOOL = 'bool',
  UINT8 = 'uint8',
  UINT256 = 'uint256',
  ADDRESS = 'address'
}

export interface ABIField {
  name: string;
  type: ABIFieldType;
  value?: string;
  indexed?: boolean;
  displayName?: string;
}

export enum StateMutabilityType {
  PURE = 'pure ',
  VIEW = 'view',
  NONPAYABLE = 'nonpayable',
  PAYABLE = 'payable'
}

export interface ABIItem {
  stateMutability?: StateMutabilityType;
  name: string;
  type: ABIItemType;
  payable?: boolean; // Deprecated, use stateMutability
  constant?: boolean; // Deprecated, use stateMutability
  anonymous?: boolean;
  payAmount: string;
  inputs: ABIField[];
  outputs: ABIField[];
}

export interface InteractWithContractState {
  network: Network;
  contractAddress: string;
  contract: Contract | undefined;
  contracts: Contract[];
  abi: string;
  customContractName: string;
  showGeneratedForm: boolean;
  submitedFunction: ABIItem;
  data: string;
  account: StoreAccount | undefined;
  rawTransaction: ITxConfig;
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
  addressOrDomainInput: string;
}
