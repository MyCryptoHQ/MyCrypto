import { combineReducers } from 'redux';

import fields, { FieldsState } from './fields/reducer';
import meta, { MetaState } from './meta/reducer';
import network, { NetworkState } from './network/reducer';
import sign, { SignState } from './sign/reducer';
import broadcast, { BroadcastState } from './broadcast/reducer';

export const transaction = combineReducers({
  fields,
  meta,
  network,
  sign,
  broadcast
});

export interface State {
  fields: FieldsState;
  meta: MetaState;
  network: NetworkState;
  sign: SignState;
  broadcast: BroadcastState;
}

export const INITIAL_STATE: State = transaction({}, { type: undefined }) as State;

export default transaction;
