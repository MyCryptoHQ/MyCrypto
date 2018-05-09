import { TypeKeys } from '../constants';
import { BroadcastAction } from './broadcast';
import { FieldAction, InputFieldAction } from './fields';
import { MetaAction } from './meta';
import { NetworkAction } from './network';
import { SignAction } from './sign';
import { SwapAction } from './swap';
import { CurrentAction } from './current';
import { SendEverythingAction } from './sendEverything';

export * from './broadcast';
export * from './fields';
export * from './meta';
export * from './network';
export * from './sign';
export * from './swap';
export * from './current';
export * from './sendEverything';

export interface ResetTransactionRequestedAction {
  type: TypeKeys.RESET_REQUESTED;
}

export interface ResetTransactionSuccessfulAction {
  type: TypeKeys.RESET_SUCCESSFUL;
  payload: { isContractInteraction: boolean };
}

export type TransactionAction =
  | InputFieldAction
  | BroadcastAction
  | FieldAction
  | MetaAction
  | NetworkAction
  | SignAction
  | SwapAction
  | ResetTransactionRequestedAction
  | ResetTransactionSuccessfulAction
  | CurrentAction
  | SendEverythingAction;
