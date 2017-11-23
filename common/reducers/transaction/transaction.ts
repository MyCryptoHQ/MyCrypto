import { fields, State as FieldState } from './fields';
import { meta, State as MetaState } from './meta';
import { network, State as NetworkState } from './network';
import { combineReducers } from 'redux';

export const transaction = combineReducers({ fields, meta, network });
export interface State {
  network: NetworkState;
  fields: FieldState;
  meta: MetaState;
}
