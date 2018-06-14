import { combineReducers } from 'redux';

import { broadcastReducer } from './broadcast/reducer';
import { fieldsReducer } from './fields/reducer';
import { metaReducer } from './meta/reducer';
import { networkReducer } from './network/reducer';
import { signReducer } from './sign/reducer';
import { TransactionState } from './types';

export const transactionReducer = combineReducers({
  broadcast: broadcastReducer,
  fields: fieldsReducer,
  meta: metaReducer,
  network: networkReducer,
  sign: signReducer
});

export const INITIAL_STATE: TransactionState = transactionReducer(
  {},
  { type: undefined }
) as TransactionState;
