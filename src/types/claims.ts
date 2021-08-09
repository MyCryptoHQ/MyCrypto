import { TAddress } from './address';
import { ITxValue } from './transactionFlow';

export enum ClaimType {
  UNI = 'UNI',
  NODE = 'NODE'
}

export enum ClaimState {
  NO_CLAIM = 'NO_CLAIM',
  UNCLAIMED = 'UNCLAIMED',
  CLAIMED = 'CLAIMED'
}

export interface ClaimResult {
  address: TAddress;
  state: ClaimState;
  amount: ITxValue;
}
