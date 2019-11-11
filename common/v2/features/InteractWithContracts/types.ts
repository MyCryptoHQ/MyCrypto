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
  id?: string;
  name: string;
  type: ABIFieldType;
  value?: string;
  indexed?: boolean;
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
  inputs: ABIField[];
  outputs: ABIField[];
}
