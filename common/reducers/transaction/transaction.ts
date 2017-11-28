import { fields, State as FieldState } from './fields';
import { meta, State as MetaState } from './meta';
import { network, State as NetworkState } from './network';
import { signing, State as SignState } from './signing';
import { combineReducers } from 'redux';

export const transaction = combineReducers({ fields, meta, network, signing });
export interface State {
  network: NetworkState;
  fields: FieldState;
  meta: MetaState;
  signing: SignState;
}
