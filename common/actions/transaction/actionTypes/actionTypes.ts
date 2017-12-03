export * from './broadcast';
export * from './fields';
export * from './meta';
export * from './network';
export * from './sign';
export * from './swap';

import { TypeKeys } from '../constants';
import { BroadcastAction } from './broadcast';
import { FieldAction } from './fields';
import { MetaAction } from './meta';
import { NetworkAction } from './network';
import { SignAction } from './sign';
import { SwapAction } from './swap';

export interface ResetAction {
  type: TypeKeys.RESET;
}

export type TransactionAction =
  | BroadcastAction
  | FieldAction
  | MetaAction
  | NetworkAction
  | SignAction
  | SwapAction
  | ResetAction;
