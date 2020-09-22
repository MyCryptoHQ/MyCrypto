import { ISimpleTxFormFull, StoreAccount } from '@types';

import { IMembershipConfig } from './config';

export interface IMembershipStepComponentProps {
  completeButtonText: string;
  resetFlow(): void;
  onComplete(payload?: any): void;
}

export interface MembershipPurchaseState {
  membershipSelected: undefined | IMembershipConfig; // @todo: Make enum
  account: StoreAccount;
}

export interface MembershipSimpleTxFormFull extends ISimpleTxFormFull {
  membershipSelected: IMembershipConfig;
}
