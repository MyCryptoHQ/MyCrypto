import { fields, State as FieldState } from './fields';
import { meta, State as MetaState } from './meta';
import { combineReducers } from 'redux';

export const transaction = combineReducers({ fields, meta });
export interface State {
  fields: FieldState;
  meta: MetaState;
}
