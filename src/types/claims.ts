import { TAddress } from './address';
import { ITxValue } from './transactionFlow';

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
