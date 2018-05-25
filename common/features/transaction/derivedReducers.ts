import { combineReducers } from 'redux';

import network, { NetworkState } from './network/reducers';
import fields, { FieldsState } from './fields/reducers';
import meta, { MetaState } from './meta/reducers';
import sign, { SignState } from './sign/reducers';
import broadcast, { BroadcastState } from './broadcast/reducers';

export const transaction = combineReducers({
  fields,
  meta,
  network,
  sign,
  broadcast
});

export interface State {
  network: NetworkState;
  fields: FieldsState;
  meta: MetaState;
  sign: SignState;
  broadcast: BroadcastState;
}

export const INITIAL_STATE: State = transaction({}, { type: undefined }) as State;

export default transaction;
