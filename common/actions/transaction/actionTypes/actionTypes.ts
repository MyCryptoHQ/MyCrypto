export * from './broadcast';
export * from './fields';
export * from './meta';
export * from './network';
export * from './sign';
export * from './swap';
export * from './current';

import { TypeKeys } from '../constants';
import { BroadcastAction } from './broadcast';
import { FieldAction, InputFieldAction } from './fields';
import { MetaAction } from './meta';
import { NetworkAction } from './network';
import { SignAction } from './sign';
import { SwapAction } from './swap';
import { CurrentAction } from './current';

export interface ResetAction {
  type: TypeKeys.RESET;
}

export type TransactionAction =
  | InputFieldAction
  | BroadcastAction
  | FieldAction
  | MetaAction
  | NetworkAction
  | SignAction
  | SwapAction
  | ResetAction
  | CurrentAction;
