import { Contract, ISimpleTxForm, ITxConfig, ITxReceipt, Network, StoreAccount } from '@types';

export enum ABIItemType {
  FUNCTION = 'function',
  EVENT = 'event',
  CONSTRUCTOR = 'constructor'
}

// @todo: Add remaining types / use string insteand of enum
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

export interface InteractWithContractState extends Omit<ISimpleTxForm, 'account'> {
  network: Network;
  contractAddress: string;
  contract: Contract | undefined;
  contracts: Contract[];
  abi: string;
  customContractName: string;
  showGeneratedForm: boolean;
  submitedFunction: ABIItem;
  data: string;
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
  addressOrDomainInput: string;
  account?: StoreAccount;
}
