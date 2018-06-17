import { combineReducers } from 'redux';

import { transactionBroadcastReducer } from './broadcast';
import { transactionFieldsReducer } from './fields';
import { transactionMetaReducer } from './meta';
import { transactionNetworkReducer } from './network';
import { transactionSignReducer } from './sign';
import * as types from './types';

export const transactionReducer = combineReducers({
  broadcast: transactionBroadcastReducer.broadcastReducer,
  fields: transactionFieldsReducer.fieldsReducer,
  meta: transactionMetaReducer.metaReducer,
  network: transactionNetworkReducer.networkReducer,
  sign: transactionSignReducer.signReducer
});

export const INITIAL_STATE: types.TransactionState = transactionReducer(
  {},
  { type: undefined }
) as types.TransactionState;
