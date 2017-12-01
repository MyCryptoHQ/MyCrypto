import { State } from './typings';
import {
  TypeKeys as TK,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction
} from 'actions/transaction';
import { ReducersMapObject } from 'redux';
import { createReducerFromObj } from 'reducers/transaction/helpers';

const INITIAL_STATE: State = {
  local: { signedTransaction: null },
  web3: { transaction: null },
  indexingHash: null,
  pending: false
};

const reducerObj: ReducersMapObject = {
  [TK.SIGN_LOCAL_TRANSACTION_REQUESTED]: (state: State): State => ({
    ...state,
    pending: true
  }),
  [TK.SIGN_LOCAL_TRANSACTION_SUCCEEDED]: (
    _,
    { payload }: SignLocalTransactionSucceededAction
  ): State => ({
    indexingHash: payload.indexingHash,
    pending: false,

    local: { signedTransaction: payload.signedTransaction },
    web3: { transaction: null }
  }),
  [TK.SIGN_WEB3_TRANSACTION_SUCCEEDED]: (
    _,
    { payload }: SignWeb3TransactionSucceededAction
  ): State => ({
    indexingHash: payload.indexingHash,
    pending: false,

    local: { signedTransaction: null },
    web3: { transaction: payload.transaction }
  }),
  [TK.SIGN_TRANSACTION_FAILED]: _ => INITIAL_STATE,
  [TK.RESET]: _ => INITIAL_STATE
};

export const sign = createReducerFromObj(reducerObj, INITIAL_STATE);
