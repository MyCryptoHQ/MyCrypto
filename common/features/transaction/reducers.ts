import { combineReducers } from 'redux';

import network, { NetworkState } from './network/reducer';
import fields, { FieldsState } from './fields/reducer';
import meta, { MetaState } from './meta/reducer';
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
  network: NetworkState;
  fields: FieldsState;
  meta: MetaState;
  sign: SignState;
  broadcast: BroadcastState;
}

export const INITIAL_STATE: State = transaction({}, { type: undefined }) as State;

export default transaction;
