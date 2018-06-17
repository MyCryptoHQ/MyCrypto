import { combineReducers } from 'redux';

import * as transactionBroadcastReducer from './broadcast/reducer';
import * as transactionFieldsReducer from './fields/reducer';
import * as transactionMetaReducer from './meta/reducer';
import * as transactionNetworkReducer from './network/reducer';
import * as transactionSignReducer from './sign/reducer';
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
