import { TypeKeys } from '../constants';
import { BroadcastAction } from './broadcast';
import { FieldAction, InputFieldAction } from './fields';
import { MetaAction } from './meta';
import { NetworkAction } from './network';
import { SignAction } from './sign';
import { SwapAction } from './swap';
import { CurrentAction } from './current';
import { SendEverythingAction } from './sendEverything';
import { State as FieldState } from 'reducers/transaction/fields';
import { State as MetaState } from 'reducers/transaction/meta';
import { State as SignState } from 'reducers/transaction/sign';

export * from './broadcast';
export * from './fields';
export * from './meta';
export * from './network';
export * from './sign';
export * from './swap';
export * from './current';
export * from './sendEverything';

export interface ResetAction {
  type: TypeKeys.RESET;
  payload: {
    include: {
      fields?: (keyof FieldState)[];
      meta?: (keyof MetaState)[];
      sign?: (keyof SignState)[];
    };
    exclude: {
      fields?: (keyof FieldState)[];
      meta?: (keyof MetaState)[];
      sign?: (keyof SignState)[];
    };
  };
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
  | CurrentAction
  | SendEverythingAction;
