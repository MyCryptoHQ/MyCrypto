import { combineReducers } from 'redux';

import { broadcastReducer, BroadcastState } from './broadcast';
import { fieldsReducer, FieldsState } from './fields';
import { metaReducer, MetaState } from './meta';
import { networkReducer, NetworkState } from './network';
import { signReducer, SignState } from './sign';

export const transactionReducer = combineReducers({
  broadcast: broadcastReducer,
  fields: fieldsReducer,
  meta: metaReducer,
  network: networkReducer,
  sign: signReducer
});

export interface State {
  broadcast: BroadcastState;
  fields: FieldsState;
  meta: MetaState;
  network: NetworkState;
  sign: SignState;
}

export const INITIAL_STATE: State = transactionReducer({}, { type: undefined }) as State;
