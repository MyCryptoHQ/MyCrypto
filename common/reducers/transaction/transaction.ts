import { fields, State as FieldState } from './fields';
import { meta, State as MetaState } from './meta';
import { network, State as NetworkState } from './network';
import { sign, State as SignState } from './sign';
import { broadcast, State as BroadcastState } from './broadcast';
import { combineReducers } from 'redux';

export const transaction = combineReducers({
  fields,
  meta,
  network,
  sign,
  broadcast
});

export interface State {
  network: NetworkState;
  fields: FieldState;
  meta: MetaState;
  sign: SignState;
  broadcast: BroadcastState;
}

export const INITIAL_STATE: State = transaction({}, { type: undefined }) as State;
